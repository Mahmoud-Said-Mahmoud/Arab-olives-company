"""Build the layered jar for the scroll scene from the real product photograph.

Run from the web/ folder:  py tools/build_jar_layers.py
Reads the mixed-pickles product photo (the reference for the packaging) and the silhouette
already stored with assets-src/jar/body.webp, and writes five layers to public/img/jar/.
Every layer is the photograph itself, cut or masked — nothing is drawn or generated.

  body.webp   the whole jar: glass, contents and label (back of the stack)
  glass.webp  the front glass: the photo's own highlights, plus a faint veil of the photo,
              so anything placed between body and glass reads as being behind the glass
  neck.webp   the threaded neck and rim, opaque at the top and fading out below
  label.webp  the label band, opaque
  lid.webp    the lid, cut from the same photo

All layers except the lid share the body's 816x950 canvas, so they stack without offsets.
"""
import os
import numpy as np
from PIL import Image, ImageFilter

SRC = 'public/images/products/مخلل/مخلل مشكل.png'
OLD = 'assets-src/jar'
OUT = 'public/img/jar'
BOX = (216, 216, 1032, 1166)          # jar body in the 1254x1254 photo (see src/data/assets.json)
LABEL = (285 - 6, 653 + 7)            # label band, in body rows, with a small safety margin
RIM_CLEAR = 9                         # top rows of the body still show the lid's lower edge

os.makedirs(OUT, exist_ok=True)
photo = np.asarray(Image.open(SRC).convert('RGB').crop(BOX)).astype(np.float32)
sil = np.asarray(Image.open(f'{OLD}/body.webp').convert('RGBA'))[..., 3].astype(np.float32) / 255
H, W = sil.shape
rows = np.arange(H, dtype=np.float32)[:, None]

# The lid's lower edge is baked into the first rows; fade them so the open jar has a clean rim.
sil = sil * np.clip((rows - RIM_CLEAR) / 4, 0, 1)


def save(rgb, alpha, name, q=88):
    a = (np.clip(alpha, 0, 1) * 255).astype('uint8')
    im = Image.fromarray(np.dstack([rgb.clip(0, 255).astype('uint8'), a]), 'RGBA')
    im.save(f'{OUT}/{name}', 'WEBP', quality=q, method=6)
    print(name, os.path.getsize(f'{OUT}/{name}') // 1024, 'KB')


save(photo, sil, 'body.webp', 90)

# Label: the band of rows it occupies, inside the silhouette.
band = ((rows >= LABEL[0]) & (rows <= LABEL[1])).astype(np.float32)
save(photo, sil * band, 'label.webp', 90)

# Neck and rim: fully opaque down to the lowest thread, then fading out over the shoulder.
neck = np.clip((96 - rows) / 40, 0, 1)
save(photo, sil * neck, 'neck.webp', 88)

# Front glass: bright, colourless pixels are reflections on the glass or on wet surfaces.
lo = photo.min(axis=2)
shine = np.clip((lo - 205) / 40, 0, 1)
shine = np.asarray(Image.fromarray((shine * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
veil = 0.16                            # a little of the photo over everything behind the glass
glass = np.maximum(shine * 0.9, veil) * sil * (1 - band)
save(photo, glass, 'glass.webp', 84)

Image.open(f'{OLD}/lid.webp').save(f'{OUT}/lid.webp', 'WEBP', quality=90, method=6)
print('lid.webp copied')
