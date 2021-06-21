from flask import Flask, render_template, request
import random
import os
from shutil import copyfile
import generate as g
import os



app = Flask(__name__)

@app.route("/", methods = ['POST', 'GET'])
def index():
    # If the parameter directory is not None, then return the names of the
    # image files
    if request.form.get("directory") != None:
        return str(os.listdir("./static/img/"))

    # If the parameter count is not None, then generate count number
    # of new images
    if request.form.get("count") != None:
        file = open("./static/helper.txt", "w")
        file.write("true")
        file.close()

        if request.form.get("num") != None:
            g.generate_images(int(request.form.get("num")), int(request.form.get("count")))
        else:
            g.generate_images(len(os.listdir("./static/img/")) + 1, int(request.form.get("count")))
        file = open("./static/helper.txt", "w")
        file.write("false")
        file.close()
        return "t"

    else:
        #FileLocation = "/temp_img/" + str(random.choice(["1.jpg", "2.jpg", "3.jpg"]))


        # Delete all images currently in the img directory
        for f in os.listdir("./static/img/"):
            os.remove("./static/img/" + f)


        # Generate new images
        g.generate_images(1, 5)

        return render_template('index.html', file="img/1.png")


