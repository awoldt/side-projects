package main

import (
	"fmt"
	"strconv"
	"sync"
)

var shadow int = 234                             //package level variable can be shadowed
const myconst string = "I love to play baseball" //package level constant can be shadowed
func main() {
	//1. VARIABLES
	//var keyword, name of variable, variable type
	//can also declare like this => i:=23, go will infer that i is of type int
	var num int = 23
	fmt.Println(num)

	//you can delcare variables all at once like this
	var (
		name   string = "John"
		age    int    = 23
		gender string = "Male"
	)
	fmt.Printf("Name: %v, Age: %v, Gender: %v\n", name, age, gender)

	//shadowing
	//inner most scope of variable will take precedent
	//notice shadow variable just outside of main function
	//we can redeclare this variable inside main function and it will take precedent
	fmt.Println(shadow)
	var shadow int = 1 //function level variable shadow
	fmt.Println(shadow)

	//conversion function
	//ex: float32()
	var b int = 123
	fmt.Printf("%v, %T\n", b, b)
	var j float32 = float32(b)
	fmt.Printf("%v, %T\n", j, j)
	//converting from int to string does not work how you would expect it to
	var l int = 4234
	var lString string = strconv.Itoa(l) //Itoa = int to string, Atoi = string to int
	fmt.Printf("%v, %T\n", l, l)
	fmt.Printf("%v, %T\n", lString, lString)
	//notice how lString is not a string of 4234
	//you need to use a special package for this

	//summary
	//1. variable declaration
	//ex: var foo int
	//ex: var foo int = 23
	//ex: foo := 33 (use this one the most)
	//2. cant redclare variable, but can shadow them
	//3. ALL variables must be used
	//4. lowercase first letter means variable is scopped in package, first letter uppercase means variable can be exported out of package
	//no private scope
	//5. when naming variables, keep names short if variable is only used inside current package, keep names longer if used in other packages

	//=============================================================================

	//2. PRIMITIVES
	//booleans, numeric(many different types), text
	var n bool = true
	fmt.Printf("%v, %T\n", n, n)

	//variables that are not initilized with a value are set to 0
	var x bool //0 with bools are equal to false
	fmt.Printf("%v, %T\n", x, x)

	//numeric types
	//int (int8, int16, int32, int64, uint8, uint16, uint32)
	//cannot add 2 ints of different types
	//EX:
	//var a int = 10
	//var bb int8 = 24
	// fmt.Println(a + bb) (THIS WOULD NOT WORK)
	//would have to do type conversion fmt.Println(a + int(bb))

	//BIT OPERATORS
	//this is confusing as fuck
	aa := 10              // 1010  binary
	zz := 3               // 0011  binary
	fmt.Println(aa & zz)  //and (what bits are set in both the first and second, ie BOTH must be 1) === 0010
	fmt.Println(aa | zz)  //or (one OR the other is set) === 1011
	fmt.Println(aa ^ zz)  //exclusive or (same as or, but both CANNOT be set) === 1001
	fmt.Println(aa &^ zz) //and not (only set true if NEITHER bits are set) === 0100

	//BIT SHIFTING
	//this is even more fucking confusing :(
	aaa := 3
	fmt.Println(aaa >> 3) //bit shift right 3 times === 1
	fmt.Println(aaa << 3) //bit shift left 3 times === 64

	//floating point numbers
	//floating are always initialized to float64 if := is used
	//remainder operator (%) are only available for int types
	f := 3.14
	f = 13.8e14
	fmt.Println(f)

	//complex numbers
	//use i to represent imaginary number
	//a:= 1+2i
	//fuck learning this

	//TEXT (2 types)
	//1. STRING, any utf8 character
	//strings are sequence of BYTES in golang
	s := "Hello this is a string" //array of characters
	fmt.Println(s)
	fmt.Printf("The first letter of the above string is %v\n", string(s[0]))
	//you can concat strings easily
	ss := "This is another string"
	fmt.Printf("%v\n", s+". "+ss) //joins strings together
	//you can convert a string into a 'slice' of bytes
	sss := "I love to go to the beach"
	by := []byte(sss) //convert the sss string into an array of bytes
	fmt.Printf("%v, %T\n", by, by)

	//2. RUNE, any utf32 character
	r := 'a'
	fmt.Printf("%v, %T\n", r, r) //runes are typealias for int32's

	//summary
	//1. BOOLEAN
	//NOT an alias for any other types
	//0 is false
	//2. NUMERIC TYPES
	//-integers (signed integers, unisigned integers)
	//signed ints int-8 through int-64
	//unsigned ints uint-8 through uint-32 (can only ever be positive)
	//bitwise operations, and or exclusive or and not
	//can't mix types in the same family (uint16 + uint32 === ERROR)
	//-floating point numbers
	//32 and 64 bit versions
	//2 ways to declare => 2.12 or 2e12
	//complex numbers (fuck this)
	//TEXT TYPES
	//-strings
	//utf8, CANNOT BE CHANGED
	//can be concated with + (similar to javascript)
	//can be converted to an array of bytes
	//-rune
	//utf-32
	//alias for int32

	//=============================================================================

	//3. CONSTANTS
	//typed constant
	//cannot change at any point
	//arrays are mutable, CANNOT be a constant
	//constants can be shadowed
	const myconst int = 34
	fmt.Printf("%v, %T\n", myconst, myconst)
	//constants can be used alongside other variables as long as the type is the same
	xx := 234
	fmt.Printf("%v, %T\n", myconst+xx, myconst+xx) //this will be a variable, not a const
	//enumarated constants (iota)
	const (
		a = iota
		bb
		c
		d
	)
	fmt.Printf("%v\n", a)
	fmt.Printf("%v\n", bb)
	fmt.Printf("%v\n", c)
	fmt.Printf("%v\n", d)

	//summary
	//constants are immutable, but they can be shadowed
	//must have a value set before compile time
	//untyped constants can work with similar types
	//ex: const x = 23 can be used along with int8, int16 , uint16, ........
	//enumarated constants allows related constants to be created easily
	//iota starts at 0 in each const block

	//=============================================================================

	//4. ARRAYS AND SLICES (collections)
	grades := [...]int{456, 452, 123} //[] declares array, [3] determines how many elements in array (optional), {} can be used to populate array when declared
	fmt.Printf("%v\n", grades)
	//[...] this tells complier to make array the size of what was declared i.e => make an array with a length of 3
	var students [3]string
	students[0] = "Vleck"
	students[1] = "Jackson"
	students[2] = "Apu"
	fmt.Println(students)
	fmt.Printf("The second student in the array is %v\n", students[1])
	fmt.Printf("There are %v students stored in this array\n", len(students))

	//arrays can be made up of any type, BUT it can only be made up of that type, cannot mix multiple types
	var identityMatrix [3][3]int = [3][3]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}} // [[1 0 0] [0 1 0] [0 0 1]]
	fmt.Println(identityMatrix)

	//arrays in GO are actually considered values
	//in other languages when you create an array it is pointing to those values
	//in GO, when you copy an array, you are literally copying the entire array
	aaaa := [...]int{1, 2, 3}
	bbb := aaaa
	bbb[1] = 234
	fmt.Println(aaaa)
	fmt.Println(bbb)
	//aaaa and bbb are two SEPERATE arrays, notice how when changing the second index of bbb it DOES NOT change the second index of the aaaa array
	//SLICES
	//slices copy a portion of an array, similar to javascript
	//these slices ALL POINT TO THE SAME UNDERLYING ARRAY, IF YOU CHANGE THE ORIGINAL A2 ARRAY, EACH OF SLICES WILL CHANGE
	a2 := []int{3, 4, 5, 6, 7, 8}
	b2 := a2[:]   //slices all elements in an array
	b3 := a2[2:]  //slices from 2nd index to end (INCLUDES 2nd index)
	b4 := a2[:3]  //slices all the way to the 3rd index (EXCLUDES 3rd index)
	b5 := a2[2:4] //slices array inbetween 2nd and 4th index (INCLUDES the 2nd index and EXCLUDES the 4th index) INNER SLICE
	fmt.Printf("%v\n", b2)
	fmt.Printf("%v\n", b3)
	fmt.Printf("%v\n", b4)
	fmt.Printf("%v\n", b5)

	//heres a way to remove only the last element in an array
	b6 := a2[:len(a2)-1]
	fmt.Println(b6)
	//removing an element from the middle of an array (remove 5 from array)
	b7 := append(a2[:2], a2[3:]...)
	fmt.Println(b7)

	//summary
	//ararys are collections of items with the same types
	//arrays are FIXED in size at compile time can can NEVER be changed
	//there are 3 main ways to declare a new array
	//a:=[3]int{1,2,3} a:=[...]int{1,2,3} and var a [3]int
	//len returns the size of an array
	//when assigning an array to a new variable, all of the elements are copied into a NEW array that have a different address in memory
	//slices refer to an existing array
	//can use the make function to create a new slice
	//length a capacity, length is how many elements are currently in array and capactity is how many elements can be stored
	//append adds an element to a slice

	//=============================================================================

	//5. MAP AND STRUCTS
	//- MAPS
	statePopulations := map[string]int{
		"North Carolina": 234234234234,
		"Alabama":        123432,
	}
	fmt.Println(statePopulations)
	//map[KEY]VALUE
	//slices CANNOT be a key to a map
	//you can also use the make function to create maps
	//you can pull out values of a map by declaring what key you want
	fmt.Println(statePopulations["North Carolina"])
	//you can add a value to a map like this
	statePopulations["Ohio"] = 134234
	fmt.Println(statePopulations["Ohio"])

	//THE RETURN ORDER OF A MAP IS NOT GUARENTEED
	//you can use delete function to remove value from map
	delete(statePopulations, "Alabama")
	fmt.Println(statePopulations)

	//comma OK notation helps determine if key is present in map
	//if you were to spell Ohio wrong when retrieving map value, it would return 0 (you might assume Ohio then to have a population of 0)
	q, ok := statePopulations["OHiosd"]
	fmt.Println(q, ok) //0 false
	q2, ok := statePopulations["Ohio"]
	fmt.Println(q2, ok) //134234 true

	//you find how many values in map using the len function, similar to arrays and slices

	// -STRUCT
	//essentially describing what the data is going to look like
	type movie struct {
		name   string
		budget float32
		actors []string
	}
	newMovie := movie{
		name:   "Aliens 4",
		budget: 123.234,
		actors: []string{"Jackson L", "Aaron R"},
	}
	fmt.Println(newMovie)
	//accessing data in a struct is similar to accessing data in objects with javascript
	fmt.Println(newMovie.actors[1]) //Aaron R

	//anonymous structs
	newMovie2 := struct{ name string }{name: "Aliens123"}
	fmt.Println(newMovie2)

	//when copying structs to new variables, these create entirely new structs. They DO NOT refer back to the original data unlike maps and slices

	//embedding
	//Go does not support traditional inheritance like other OOP languages

	type animal struct {
		name string
		age  int
	}

	type bird struct {
		animal
		canFly      bool
		hasFeathers bool
	}

	newBird := bird{
		animal:      animal{name: "asdfasdf", age: 234},
		canFly:      true,
		hasFeathers: true,
	}

	fmt.Println(newBird)

	//tags (confusing)
	//have to use reflect import if using tags
	// type car struct {
	// 	name  string `required max:"100"`
	// 	model string
	// }

	//summary
	//maps and structs
	//maps are collections of values and keys (objects)
	//you can declare maps via literals OR using the make function
	//accses values with key => myMap["Key"] = "Value"
	//structs describe what a data type looks like
	//normally created as types, but you can create an anonymous struct
	//structs are values, manipulating a struct in one location will not change the value in any other struct
	//there is no inheritance with structs, but you can use embedding

	//=============================================================================

	//6. CONTROL FLOW
	//IF, ELSE IF, AND SWTICH STATEMENT
	//||or &&and !oppsite bool
	//EASY SHIT
	if true {
		fmt.Println("This statement is true")
	}
	guess := 23
	numbertoguess := 23
	if guess < 0 || guess > 100 {
		fmt.Println("Error: number being guessed cannot be less than 0 OR greater than 100")
	} else {
		fmt.Println("Checking to see if number guessed is correct")
		if guess == numbertoguess {
			fmt.Println("NICE GUESS")
		}
	}

	//short circuting is when an OR evaluation will not check any other statement if one equates to true
	//ex: if 3==3 || 100==100 || 9==9 (once 3==3 is evaluated to true, Go will not check any of the other statements)

	//switch statements
	//EASY SHIT
	switchValue := 23
	switch switchValue {
	case 1:
		fmt.Println("Correct the switch value is 23!")
	case 2:
		fmt.Println("Correct the switch value is 2!")
	default:
		fmt.Println("neither 1 or 2 is equal to ", switchValue)
	}
	//you can add multiple cases in single line
	switchValue2 := 54
	switch switchValue2 {
	case 14, 23, 5, 34:
		fmt.Println("the value was equal to the first case statement!")
	case 2, 234, 543, 456, 54:
		fmt.Println("the value was equal in the second case statement!")
	default:
		fmt.Println("none of the case statements eqated to ", switchValue)
	}
	//you can also open up switch statement without variable next to it
	switchValue3 := 23
	switch {
	case switchValue3 <= 10:
		fmt.Println("first case is correct")
	case switchValue3 <= 20:
		fmt.Println("second case is correct")
	case switchValue3 <= 30:
		fmt.Println("third case is correct")
	default:
		fmt.Println("none of the statements are correct")
	}
	//using a fallthrough will evaluate each case regardless is statement before it was true
	//be careful as it will execute the next case regardless if it is true or not
	switchValue4 := 4
	switch {
	case switchValue4 <= 10:
		fmt.Println("first case is correct")
		fallthrough
	case switchValue4 <= 20:
		fmt.Println("second case is correct")
		fallthrough
	case switchValue4 <= 30:
		fmt.Println("third case is correct")

	default:
		fmt.Println("none of the statements are correct")
	}

	//summary
	// EASY dont need a summary

	//=============================================================================

	//7. LOOPS
	//FOR
	//simple loops, exiting early, and looping through collections
	//lets create a simple loop that will count to 25 and log each time
	for i := 0; i < 25; i++ {
		fmt.Println("The loop is on iteration ", i+1)
	}

	//dont have to declate iterator on line
	//remember to use semicolon!
	//this format will have the iterator scoped to the function
	//the for loop above will have the iterator scoped to the loop itself
	iterator := 0
	for ; iterator < 10; iterator++ {
		fmt.Println(iterator)
	}

	//infinate for loop
	i2 := 0
	for {
		fmt.Println(i2 + 1)
		i2++
		if i2 == 50 {
			break
		}
	}

	//you can use continue also
	//print out all even numbers between 0 and 60
	i3 := 0
	for ; i3 < 60; i3++ {

		if i3%2 != 0 {
			continue
		}
		fmt.Println(i3)
	}

	//labels
	//you can break out of nested loops easily
	//Loop:
	// //for {
	// 	for {
	// break Loop
	// 	}
	// }

	//working with collections and loops
	ssss := []int{123, 345, 567}
	for i, v := range ssss {
		println(i, v)
	}
	//you can also do this with strings
	stringLoop := "Hello"
	for i, v := range stringLoop {
		println(i, string(v))
	}
	//when looping over maps and you only want the value and not the key do this
	exMap := map[string]float32{
		"black": 132.21,
		"red":   12.2597,
		"green": 465.254,
	}
	//underscores in GO represent a blank identifier
	//can use these to prevent compiler from throwing error, it is used bc you have to provide a value but don't need it
	//i want to only print out the values of the map, not the keys
	for _, v := range exMap {
		fmt.Println(v)
	}

	//summary
	//for statments
	//there are 3 main ways to create a loop
	//-for i:=0; i<100 i++
	//-for someArray
	//-for
	//exiting early from a for loop can be done with break, continue, and labels
	//looping over any type of collection can be used with the range keyword
	//ex: for i,v:=range someArray

	//=============================================================================

	//8. CONTROL FLOW pt2
	//DEFER
	//PANIC
	//RECOVER

	//(ALL DEFER STUFF IS COMMENTED OUT TO MAKE CONSOLE LESS CONFUSING TO READ WITH ALL OTHER CONCEPTS BEING LOGGED THROUGHOUT THE PROGRAM)

	//DEFER
	//this would typically log start, middle, then end
	//defer will make the function wait until the surrounding function returns
	// fmt.Println("Start")
	// defer fmt.Println("Middle")
	// fmt.Println("End")

	// //defer functions are executed in LIFO order (last in first out)
	// //in the examlpe below, end will be the first to execute and start will be the last
	// defer fmt.Println("Start")
	// defer fmt.Println("Middle")
	// defer fmt.Println("End")

	// //another example
	// //HTTP GET REQUEST
	// res, err := http.Get("https://badrapapi.com/api/filter?artist=smokepurpp")
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// defer res.Body.Close() //this will wait until all resources have been operated on before closing
	// //defering like this is not always a good idea
	// robots, err := ioutil.ReadAll(res.Body)

	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Printf("%s", robots)

	//panic will throw a custom error that you defined
	//when a program is panicking, you can RECOVER
	//PANIC STATEMENTS HAPPEN AFTER DEFERS

	//sumarry
	//defer, panic, and recover
	//defer will wait until the end of a parent function
	//be careful when using defer in loops
	//only use panic when necessary
	//you can get out of a panic with a recover

	//=============================================================================

	//9. POINTERS
	//creating pointers
	//dereferencing pointers
	//the NEW function
	//working with nil
	//types with internal pointers

	//go will copy the value over to a new variable
	//this new variable is independent from the one it copied from
	tt := 24
	yy := tt
	fmt.Println(tt, yy) //this will print 24 24
	//now notice how when we change tt after this print, it wont change yy
	tt = 54
	fmt.Println(tt, yy) //this will print 54 24

	//now we can POINT yy to tt using a pointer like this
	var yyy *int = &tt
	fmt.Println(yyy) //this will print the memory address of tt
	//this will prove it
	fmt.Println(yyy, &tt)
	//can use the dereference operator infront of a pointer to figure out what value is stored at a specific location (same symbol *)
	fmt.Println(*yyy, tt)
	//now if we change tt to another int, yyy will also change as it is POINTING to this value
	tt = 234234
	fmt.Println(*yyy, tt)
	//you can also assign a new value to the deferenced pointer to change the value for both
	*yyy = 234
	fmt.Println(*yyy, tt)

	pointerArray := [3]int{1, 2, 3}
	b11 := &pointerArray[0]
	b22 := &pointerArray[1]
	b33 := &pointerArray[2]
	fmt.Println(b11, b22, b33)

	//you CANNOT perform pointer arithmatic is Go

	//a pointer that is not initialized is set to nil
	type myStruct struct {
		name string
	}

	var ms *myStruct
	ms = new(myStruct)
	//when dereferencing a struct pointer, you have to use parenthesis
	(*ms).name = "Alex"
	fmt.Println((*ms).name)
	//YOU DONT HAVE TO DEREFERENCE A POINTER LKE ABOVE, IT JUST LOOKS CLEANER
	// ms.name = "Alex"
	// fmt.Println(ms.name)
	//THIS WOULD ALSO WORK

	//ARRAYS COPY ENTIRE VALUE OVER TO NEW VARIABLE
	//MAPS AND SLICES WILL NOT COPY OVER VALUES TO ANOTHER VARIABLE
	//IT WILL SET IT EQUAL TO THE POINTER THAT POINTS TO THAT ORIGINAL DATA TYPE
	//CHANGING A VARIABLE THAT IS SET EQUAL TO A MAP OR SLICE WILL CHANGE THE ORIGINAL MAP OR SLICE AND EVERY OTHER VARIABLE THAT POINTS TO IT

	//summary
	//pointers are created with *
	//*int is a pointer to an integer
	//the & symbol is the address of the pointer
	//dereference pointers with * also

	//=============================================================================

	//10. FUNCTIONS

	printMessage("RAWR XD")
	printMessageRepeat("I like to go to the beach", 10)
	printNames("Alex", "Wings", "Kerry")
	name1 := "jack"
	address := "12312 Ridge Ln"
	pointerFunction(&name1, &address)
	//we changed the value of name1 inside of the function
	fmt.Println(name1)
	sumResult, err := getSum("Calling the sum function", 1, 4, 5, 6, 7, 8, 9, 9, 234, 5, 5, 4, 4, 5, 6, 7, 7, 7, 5, 4, 56, 6, 6, 7, 7, 7, 6, 6, 7, 7)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("The sum of all the values is", *sumResult)

	//anonymous function
	func() {
		fmt.Println("ANONYMOUS FUNCTION")
	}()

	//METHODS
	//methods receive a special argument
	//the receiver is between the func keyword and the actual method
	//methods DO NOT change values of original type, it copies data
	p := person{
		name: "Alex",
		age:  23,
	}
	p.printPerson()

	//summary
	//EASY SHIT

	//=============================================================================

	//11. INTERFACES
	//interfaces are types
	//THIS IS CONFUSING AS FUCK
	//LOOK MORE INTO THIS AT A LATER DATA
	//best practices
	//use many small interfaces instead of massive ones

	//summary
	//interfaces describe behaviors instead of data fields (structs)

	//=============================================================================

	//12. GOROUTINES
	//use the keyword GO to initiate a goroutine

	wg.Add(1)
	go sayHello()
	wg.Wait()

	for i := 0; i < 10; i++ {
		wg.Add(2)
		go sayHelloIncrement()
		go increment()
	}
	wg.Wait()

	for i := 0; i < 10; i++ {
		wg.Add(2)
		m.RLock()
		go sayHelloMutex()
		m.Lock()
		go incrementMutex()
	}
	wg.Wait()

	//summary
	//goroutines are created with go keyword
	//when using anonymous functions, pass data as local variable
	//you can use sync.waitgroups to wait for goroutines to complete
	//mutex will help protect data read and write
	//parallelism will use CPU threads equal to available cores
	//more threads can increase performance, but it can also slow it down
	//use -race tag to check goroutines racing each other

	//=============================================================================

	//13. CHANNELS
	wg2 := sync.WaitGroup{}
	channel := make(chan int)
	wg2.Add(2)
	//recieving channel
	go func() {
		i := <-channel
		fmt.Println(i)
		wg2.Done()
	}()
	//sending goroutine
	go func() {
		channel <- 42
		wg2.Done()
	}()
	wg2.Wait()

	//summary
	//channels sync data between go routines
	//create channels like make(chan int)
	//SEND MESSAGE ch <- val
	//RECIEVE MESSAGE val <- channel
}

// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// =============================================================================
// END OF MAIN FUNCTION

var counter = 0
var mutexCounter = 0

func sayHello() {
	fmt.Println("Hello from goroutine")
	wg.Done()
}

func sayHelloIncrement() {
	fmt.Printf("Hello, counter => %v\n", counter)
	wg.Done()
}
func increment() {
	counter++
	wg.Done()
}

func sayHelloMutex() {

	fmt.Println("Hello mutex, counter => ", mutexCounter)
	m.RUnlock()
	wg.Done()
}
func incrementMutex() {

	mutexCounter++
	m.Unlock()
	wg.Done()
}

var wg = sync.WaitGroup{}
var m = sync.RWMutex{}

type person struct {
	name string
	age  int
}

// use pointer to change the orignal variable instead of creating copy
// better performance
func (p *person) printPerson() {
	fmt.Println("The person's name is", p.name, "and they are", p.age, "years old")
}

// starts with FUNC keyword
func printMessage(msg string) {
	fmt.Println(msg)
}

func printMessageRepeat(msg string, loop int) {
	for i := 0; i < loop; i++ {
		fmt.Println(msg)
	}
}

// if all parameters have the same type, you can add the type at the end
func printNames(name1, name2, name3 string) {
	fmt.Println(name1, name2, name3)
}

// passing in pointers as paramters is efficient
func pointerFunction(name, address *string) {
	fmt.Println(*name, " lives at ", *address)
	*name = "NEWNAME"
}

// you can pass in multiple values and use them inside function with use of the spread operator
// IT HAS TO BE LAST PARAMETER IF ANOTHER PARAMETER IS PRESENT
// you can return pointers
// using errors in return values is a good idea
func getSum(msg string, values ...int) (*int, error) {
	//check to make sure no values are negative
	//if there is, throw an error
	for i := 0; i < len(values); i++ {
		if values[i] < 0 {
			return nil, fmt.Errorf("Cannot use ngative numbers")
		}
	}

	result := 0

	for i := 0; i < len(values); i++ {
		result += values[i]
	}

	return &result, nil
}
