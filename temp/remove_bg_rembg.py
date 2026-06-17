import os
from PIL import Image
from rembg import remove

# Paths
brain_dir = "C:/Users/PURVANSH JOSHI/.gemini/antigravity-ide/brain/1a2c14e2-6f7b-49b0-aa3b-13f7b45892d9"
output_dir = "d:/IEEEsoc.web/public/assets"

mapping = {
    "athena_cutout_1781618027335.png": "athena_cutout.png",
    "hephaestus_cutout_1781618043263.png": "hephaestus_cutout.png",
    "atlas_cutout_1781618057764.png": "atlas_cutout.png",
    "ares_cutout_1781618081884.png": "ares_cutout.png",
    "prometheus_cutout_1781618095029.png": "prometheus_cutout.png",
    "aristotle_cutout_1781618105466.png": "aristotle_cutout.png"
}

print("Starting background removal utilizing rembg AI model...")

for src_name, dest_name in mapping.items():
    src_path = os.path.join(brain_dir, src_name)
    dest_path = os.path.join(output_dir, dest_name)
    
    if os.path.exists(src_path):
        print(f"Processing: {src_name}...")
        try:
            input_image = Image.open(src_path)
            # Remove background using rembg
            output_image = remove(input_image)
            # Save as transparent PNG
            output_image.save(dest_path, "PNG")
            print(f"Successfully saved to: {dest_name}")
        except Exception as e:
            print(f"Error processing {src_name}: {e}")
    else:
        print(f"Source file not found: {src_path}")

print("Background removal complete!")
