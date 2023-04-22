import sys
import os
# from PIL import Image
print(os.getcwd())
imagePath=sys.argv[1]
totalPath=str(os.getcwd())+imagePath
if(os.path.isfile(totalPath)):
    print(True)
else:
    print(False)