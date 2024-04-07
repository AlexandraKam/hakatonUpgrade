import json
import base64

print("Reading response.json...")
with open('response.json', 'r') as file:
    response = json.load(file)

print("Decoding stitched_image...")
stitched_image = base64.b64decode(response['stitched_image'])

print("Decoding annotated_image...")
annotated_image = base64.b64decode(response['annotated_image'])

print("Saving stitched_image.png...")
with open('stitched_image.png', 'wb') as file:
    file.write(stitched_image)

print("Saving annotated_image.png...")
with open('annotated_image.png', 'wb') as file:
    file.write(annotated_image)

print("Done.")
