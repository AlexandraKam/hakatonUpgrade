from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import io
from stitching import Stitcher
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)

def process_images(image1, image2):
    settings = {
        "detector": "sift", 
        "confidence_threshold": 1e-6,
        "finder": "dp_color",
        "adjuster": "ray",
        "warper_type": "plane",
        "block_size": 10,
        "nfeatures": 15000,
        "match_conf": 0.5,
        "wave_correct_kind": "auto",
        "compensator": "gain_blocks",
        "matches_graph_dot_file": "matches_graph.dot"
    }

    stitcher = Stitcher(**settings)
    panorama = stitcher.stitch([image1, image2])

    def plot_image(img, figsize_in_inches=(5, 5), dpi=300):
        fig, ax = plt.subplots(figsize=figsize_in_inches, dpi=dpi)
        ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        ax.axis('off')
        plt.tight_layout(pad=0)
        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png', dpi=dpi, bbox_inches='tight', pad_inches=0)
        plt.close(fig)
        img_bytes.seek(0)
        return img_bytes

    img_bytes = plot_image(panorama)
    return img_bytes

@app.route('/api/process-images', methods=['POST'])
def process_images_api():
    # Получение загруженных изображений из запроса
    image1 = request.files['image1'].read()
    image2 = request.files['image2'].read()

    # Преобразование изображений из бинарных данных в объекты OpenCV
    image1 = cv2.imdecode(np.fromstring(image1, np.uint8), cv2.IMREAD_COLOR)
    image2 = cv2.imdecode(np.fromstring(image2, np.uint8), cv2.IMREAD_COLOR)

    # Обработка изображений с помощью вашего кода
    processed_image_bytes = process_images(image1, image2)

    # Отправка обработанного изображения обратно клиенту
    return send_file(processed_image_bytes, mimetype='image/png')

if __name__ == '__main__':
    app.run()