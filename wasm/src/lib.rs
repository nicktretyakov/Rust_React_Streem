use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    // Use `js_namespace` here to bind `console.log(..)` instead of just `log(..)`
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

// Macro for logging to the console
macro_rules! console_log {
    ($($t:tt)*) => (log(&format!($($t)*)))
}

#[wasm_bindgen]
pub fn process_frame(data: &[u8]) -> Vec<u8> {
    console_log!("Processing frame with {} bytes", data.len());
    
    // In a real implementation, this would do actual image processing
    // For example, converting to grayscale, applying filters, etc.
    
    // For this example, we'll just return the original data
    // with a simple modification (invert colors for demonstration)
    let mut result = Vec::with_capacity(data.len());
    
    // Process RGBA data (4 bytes per pixel)
    for chunk in data.chunks(4) {
        if chunk.len() == 4 {
            // Invert RGB values but keep alpha
            result.push(255 - chunk[0]); // R
            result.push(255 - chunk[1]); // G
            result.push(255 - chunk[2]); // B
            result.push(chunk[3]);       // A (unchanged)
        }
    }
    
    result
}

#[wasm_bindgen]
pub fn detect_motion(prev_frame: &[u8], curr_frame: &[u8], width: u32, height: u32, threshold: u32) -> bool {
    if prev_frame.len() != curr_frame.len() {
        return false;
    }
    
    let mut diff_count = 0;
    let pixel_count = (width * height) as usize;
    
    // Compare frames (assuming RGBA format)
    for i in (0..prev_frame.len()).step_by(4) {
        let prev_r = prev_frame[i];
        let prev_g = prev_frame[i + 1];
        let prev_b = prev_frame[i + 2];
        
        let curr_r = curr_frame[i];
        let curr_g = curr_frame[i + 1];
        let curr_b = curr_frame[i + 2];
        
        // Calculate difference
        let diff = ((prev_r as i32 - curr_r as i32).abs() +
                   (prev_g as i32 - curr_g as i32).abs() +
                   (prev_b as i32 - curr_b as i32).abs()) / 3;
        
        if diff > 20 { // Pixel difference threshold
            diff_count += 1;
        }
    }
    
    // Calculate percentage of different pixels
    let diff_percentage = (diff_count as f32 / pixel_count as f32) * 100.0;
    
    // Return true if difference exceeds threshold
    diff_percentage > threshold as f32
}

#[wasm_bindgen]
pub fn apply_edge_detection(data: as f32
}

#[wasm_bindgen]
pub fn apply_edge_detection(data: &[u8], width: u32, height: u32) -> Vec<u8> {
    // Simple Sobel edge detection
    let mut result = vec![0; data.len()];
    
    // Skip the edges to simplify boundary conditions
    for y in 1..(height as usize - 1) {
        for x in 1..(width as usize - 1) {
            let idx = (y * width as usize + x) * 4; // RGBA format
            
            // Get neighboring pixels (just using red channel for simplicity)
            let tl = data[((y-1) * width as usize + (x-1)) * 4] as i32;
            let t = data[((y-1) * width as usize + x) * 4] as i32;
            let tr = data[((y-1) * width as usize + (x+1)) * 4] as i32;
            let l = data[(y * width as usize + (x-1)) * 4] as i32;
            let r = data[(y * width as usize + (x+1)) * 4] as i32;
            let bl = data[((y+1) * width as usize + (x-1)) * 4] as i32;
            let b = data[((y+1) * width as usize + x) * 4] as i32;
            let br = data[((y+1) * width as usize + (x+1)) * 4] as i32;
            
            // Sobel X and Y gradients
            let gx = -tl - 2*l - bl + tr + 2*r + br;
            let gy = -tl - 2*t - tr + bl + 2*b + br;
            
            // Gradient magnitude
            let g = ((gx*gx + gy*gy) as f32).sqrt().min(255.0) as u8;
            
            // Set all RGB channels to the edge value, keep alpha
            result[idx] = g;
            result[idx + 1] = g;
            result[idx + 2] = g;
            result[idx + 3] = data[idx + 3]; // Keep original alpha
        }
    }
    
    result
}
