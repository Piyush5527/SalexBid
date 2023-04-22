import pytesseract
from PIL import Image
import re
import sys
from datetime import datetime
from dateutil.relativedelta import relativedelta
total_path=sys.argv[1]
img = Image.open(total_path)
img = img.convert('L')
text = pytesseract.image_to_string(img)

# # if(text.find('DOB')):
# #     val=text.find('DOB')
# #     testval=text[val+5:val+16]
# #     print(testval)
match=re.search(r'(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|[1][0-2])/[0-9]+',text)
dob=datetime.strptime(match.group(),'%d/%m/%Y').date()
# print(text)
todaydate=datetime.now()
processedTodayDate=todaydate.date()
# print(processedTodayDate)
diffInAge=relativedelta(processedTodayDate,dob)
# print(diffInAge.years)
if(diffInAge.years >= 18):
    print(True)
else:
    print(False)

