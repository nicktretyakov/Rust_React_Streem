use actix_web::{web, App, Error, HttpResponse, HttpServer};
use actix_web_actors::ws;
use actix::{Actor, StreamHandler};
use diesel::{r2d2::ConnectionManager, PgConnection};
use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use futures::StreamExt;

// Database connection pool type
type DbPool = r2d2::Pool<ConnectionManager<PgConnection>>;

// WebSocket session data
struct WebSocketSession {
    last_heartbeat: Instant,
    client_id: String,
}

impl Actor for WebSocketSession {
    type Context = ws::WebsocketContext<Self>;

    fn started(&mut self, ctx: &mut Self::Context) {
        // Set heartbeat interval
        ctx.run_interval(Duration::from_secs(5), |act, ctx| {
            if Instant::now().duration_since(act.last_heartbeat) > Duration::from_secs(10) {
                println!("WebSocket Client heartbeat failed, disconnecting!");
                ctx.stop();
                return;
            }
            ctx.ping(b"");
        });
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WebSocketSession {
    fn handle(&mut self, msg: Result<ws::Message, ws::ProtocolError>, ctx: &mut Self::Context) {
        match msg {
            Ok(ws::Message::Ping(msg)) => {
                self.last_heartbeat = Instant::now();
                ctx.pong(&msg);
            }
            Ok(ws::Message::Pong(_)) => {
                self.last_heartbeat = Instant::now();
            }
            Ok(ws::Message::Text(text)) => {
                println!("Received text message: {:?}", text);
                // Process frame data and send to ML service
                // Then broadcast results to connected clients
                ctx.text("{\"status\": \"processing\"}");
            }
            Ok(ws::Message::Binary(bin)) => {
                println!("Received binary data: {} bytes", bin.len());
                // Process binary frame data
                // Forward to ML service for analysis
                ctx.binary("{\"status\": \"analyzing\"}".as_bytes());
            }
            Ok(ws::Message::Close(reason)) => {
                println!("WebSocket closed: {:?}", reason);
                ctx.close(reason);
                ctx.stop();
            }
            _ => ctx.stop(),
        }
    }
}

// WebSocket connection handler
async fn websocket_handler(
    req: web::HttpRequest,
    stream: web::Payload,
    pool: web::Data<DbPool>,
) -> Result<HttpResponse, Error> {
    println!("WebSocket connection established");
    
    let session = WebSocketSession {
        last_heartbeat: Instant::now(),
        client_id: uuid::Uuid::new_v4().to_string(),
    };
    
    ws::start(session, &req, stream)
}

#[derive(Debug, Serialize, Deserialize)]
struct AnalysisResult {
    threat_detected: bool,
    confidence: f32,
    objects: Vec<DetectedObject>,
    timestamp: i64,
}

#[derive(Debug, Serialize, Deserialize)]
struct DetectedObject {
    class: String,
    confidence: f32,
    bbox: [f32; 4], // [x1, y1, x2, y2]
}

// Handler for analyzing video frames
async fn analyze_handler(
    mut payload: web::Payload,
    pool: web::Data<DbPool>,
) -> Result<HttpResponse, Error> {
    // Collect payload bytes
    let mut bytes = web::BytesMut::new();
    while let Some(chunk) = payload.next().await {
        let chunk = chunk?;
        bytes.extend_from_slice(&chunk);
    }
    
    // Forward to ML service
    let client = reqwest::Client::new();
    let ml_service_url = std::env::var("ML_SERVICE_URL").unwrap_or_else(|_| "http://ml-service:8000/detect".to_string());
    
    let response = client
        .post(&ml_service_url)
        .body(bytes.freeze())
        .send()
        .await
        .map_err(|e| {
            eprintln!("Error sending request to ML service: {}", e);
            actix_web::error::ErrorInternalServerError(e)
        })?;
    
    let ml_results = response.json::<serde_json::Value>().await.map_err(|e| {
        eprintln!("Error parsing ML service response: {}", e);
        actix_web::error::ErrorInternalServerError(e)
    })?;
    
    // Process ML results and store in database
    // This would typically involve Diesel ORM operations
    
    // Return results to client
    Ok(HttpResponse::Ok().json(ml_results))
}

// Kafka producer for streaming events
async fn setup_kafka_producer() -> Result<(), Box<dyn std::error::Error>> {
    // In a real implementation, this would initialize a Kafka producer
    println!("Setting up Kafka producer");
    Ok(())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init();
    
    // Set up database connection pool
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create database connection pool");
    
    // Set up Kafka producer
    if let Err(e) = setup_kafka_producer().await {
        eprintln!("Failed to set up Kafka producer: {}", e);
    }
    
    println!("Starting HTTP server at http://0.0.0.0:8080");
    
    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .service(
                web::resource("/analyze")
                    .route(web::post().to(analyze_handler))
            )
            .service(
                web::resource("/ws")
                    .route(web::get().to(websocket_handler))
            )
    })
    .bind("0.0.0.0:8080")?
    .run()
    .await
}
