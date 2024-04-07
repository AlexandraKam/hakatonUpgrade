from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import numpy as np
import io
from stitching import Stitcher
import matplotlib.pyplot as plt
from ultralytics import YOLO
import base64

app = Flask(__name__)
CORS(app)

def process_images(image1, image2, is_vertical_stitching):
    settings = {
        "detector": "sift",
        "confidence_threshold": 1e-8,
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

    def plot_image(img, is_vertical, figsize_in_inches=(5, 5), dpi=300):
        if is_vertical:
            img = cv2.rotate(img, cv2.ROTATE_90_CLOCKWISE)
        return img

    stitched_image = plot_image(panorama, is_vertical_stitching)

    # Загрузка модели YOLO
    model = YOLO('best.pt')

    # Настройка параметров модели
    model.overrides['conf'] = 0.25  # Порог достоверности для NMS
    model.overrides['iou'] = 0.45  # Порог IoU для NMS
    model.overrides['agnostic_nms'] = False  # Класс-агностическая NMS
    model.overrides['max_det'] = 1000  # Максимальное количество обнаружений на изображении

    # Обработка изображения с помощью YOLO
    results = model(stitched_image)

    # Получение аннотированного изображения
    annotated_image = results[0].plot()

    def encode_image(img, figsize_in_inches=(5, 5), dpi=300):
        fig, ax = plt.subplots(figsize=figsize_in_inches, dpi=dpi)
        ax.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))
        ax.axis('off')
        plt.tight_layout(pad=0)
        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png', dpi=dpi, bbox_inches='tight', pad_inches=0)
        plt.close(fig)
        img_bytes.seek(0)
        return img_bytes

    stitched_image_bytes = encode_image(stitched_image)
    annotated_image_bytes = encode_image(annotated_image)

    return stitched_image_bytes, annotated_image_bytes

@app.route('/api/process-images', methods=['POST'])
def process_images_api():
    # Получение загруженных изображений из запроса
    image1 = request.files['image1'].read()
    image2 = request.files['image2'].read()

    # Получение значения чекбокса из запроса
    is_vertical_stitching = request.form.get('is_vertical_stitching') == 'true'

    # Преобразование изображений из бинарных данных в объекты OpenCV
    image1 = cv2.imdecode(np.frombuffer(image1, np.uint8), cv2.IMREAD_COLOR)
    image2 = cv2.imdecode(np.frombuffer(image2, np.uint8), cv2.IMREAD_COLOR)

    # Обработка изображений с учетом выбора чекбокса
    stitched_image_bytes, annotated_image_bytes = process_images(image1, image2, is_vertical_stitching)

    # Отправка обработанных изображений обратно клиенту
    return jsonify({
        'stitched_image': base64.b64encode(stitched_image_bytes.getvalue()).decode('utf-8'),
        'annotated_image': base64.b64encode(annotated_image_bytes.getvalue()).decode('utf-8')
    })

if __name__ == '__main__':
    app.run()