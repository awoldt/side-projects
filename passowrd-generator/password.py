import random

charTypes = ["lowercase", "uppercase", "symbol", "number"]
lwrCase = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
uprCase = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
symbol = ["!","@","#","$","%","^","&","*"]
number = ["0","1","2","3","4","5","6","7","8","9"]
password = ""

#user enters password length, must meet criteria
passwordError = False
while(passwordError == False):
    passwordLen = input("How long is your password (min of 6 max of 20):")
    passwordLen = int(passwordLen)
    if(passwordLen < 6 or passwordLen > 20):
        print("Error (password criteria not met)")
    else:
        passwordError = True
        
#adds characters to password string 
for i in range(passwordLen):
    charTypeToUse = random.randrange(0,len(charTypes))
    #pick from lowercase list
    if(charTypeToUse == 0):
        appendCharPosition = random.randrange(0,len(lwrCase))
        appendChar = lwrCase[appendCharPosition]
        password += appendChar
    #pick from uppercase list
    elif(charTypeToUse == 1):
        appendCharPosition = random.randrange(0,len(uprCase))
        appendChar = uprCase[appendCharPosition]
        password += appendChar
    #pick from symbol list
    elif(charTypeToUse == 2):
        appendCharPosition = random.randrange(0,len(symbol))
        appendChar = symbol[appendCharPosition]
        password += appendChar
    #pick from number list
    elif(charTypeToUse == 3):
        appendCharPosition = random.randrange(0,len(number))
        appendChar = number[appendCharPosition]
        password += appendChar

print(password)
