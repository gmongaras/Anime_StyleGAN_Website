# Anime_StyleGAN_Website
Website that uses StyleGAN2 to produce fake anime pictures.

For this website, I used the PyTorch version of StyleGAN2 to create a model that generates fake anime images. StyleGAN2 can be found at this link:
https://github.com/NVlabs/stylegan2-ada-pytorch


When the website needs to generate new images, it makes a call to generator.py. generator.py is an edited version of the one found on the official StyleGAN2 GitHub repo. It uses a pickled model generated while training the AI.


The website is using a flask app to run. The code for the flask app is located in app.py.


The data came from the following two sources:
https://github.com/bchao1/Anime-Face-Dataset
https://www.kaggle.com/soumikrakshit/anime-faces
