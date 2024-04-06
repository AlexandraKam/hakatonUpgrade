import os
from time import sleep
from stitching import Stitcher
import cv2 as cv
import matplotlib.pyplot as plt
from celery import Celery


# settings = {
#     "detector": "sift", 
#     "confidence_threshold": 0.4,
#     "blend_strength": 5,
#     "wave_correct_kind": "vert",
#     "nfeatures":5000,
#     "warper_type":"plane",
#     "matcher_type":"affine",
#     "match_conf":0.5,
#     "blender_type":"multiband",
#     "finder":"dp_colorgrad",
#     "adjuster":"ray",
# }

settings={
    "detector": "sift", 
    "confidence_threshold": 1e-6,
    "finder":"dp_color",
    "adjuster":"ray",
    "warper_type":"plane",
    "block_size":10,
    "nfeatures":15000,
    "match_conf":0.5,
    "wave_correct_kind": "auto",
    "compensator": "gain_blocks",
    "matches_graph_dot_file":"matches_graph.dot" #To plot graph type in terminal| dot -Tpng matches_graph.dot -o matches_graph.png

}

stitcher = Stitcher(**settings)
panorama = stitcher.stitch(["images/ver_top.jpeg", "images/ver_bottom.jpeg"])
# panorama = stitcher.stitch(["images/hor_left.jpeg", "images/hor_right.jpeg"])
# panorama = stitcher.stitch(["images/last_left.jpeg", "images/last_right.jpeg"])

def plot_image(img, figsize_in_inches=(5,5), dpi=300):
    fig, ax = plt.subplots(figsize=figsize_in_inches, dpi=dpi)
    
    # Поворот изображения на 90 градусов вправо
    # img_rotated = cv.rotate(img, cv.ROTATE_90_CLOCKWISE)

    ax.imshow(cv.cvtColor(img, cv.COLOR_BGR2RGB))
    
    # Удаление координатных осей
    ax.axis('off')
    
    # Удаление отступов вокруг изображения
    plt.tight_layout(pad=0)
    
    # Сохранение изображения с высоким качеством
    plt.savefig('image_file.png', dpi=dpi, bbox_inches='tight', pad_inches=0)
    
    # Закрытие фигуры для освобождения ресурсов
    plt.close(fig)
plot_image(panorama)