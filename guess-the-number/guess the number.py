import random

loop = True
random_num = random.randrange(0,10)
while(loop == True):
    print("\nThe program just generated a random number between 0 and 10, try and guess it")
    guess = input("(guess): ")
    guess = int(guess)

    #checks to see if number is between 0 and 10
    if(guess < 0 or guess > 10):
        print("error: number must be between 0 and 10\n")
    else:
        #if user guesses correct number
        if(guess == random_num):
            print("nice job, the random number was " + str(random_num) + "\n")
            loop = False
        #if user guesses the wrong number
        else:
            print("Nope try again\n")
        
