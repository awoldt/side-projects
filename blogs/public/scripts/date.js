const dateInputExact = document.getElementById('date-exact');
var timeStampExact = new Date().toLocaleString();
dateInputExact.value = timeStampExact;

const dateInputBasic = document.getElementById('date-basic'); 
var timeStampBasic = new Date();
var month = timeStampBasic.getMonth();
var day = timeStampBasic.getDate();
var year = timeStampBasic.getFullYear();

switch(month) {
    //jan
    case 0:
        month = "Jan"
        break;
    //feb
    case 1:
        month = "Feb"
        break;
    //mar
    case 2:
        month = "Mar"
        break;
    //Apr
    case 3:
        month = "Apr"
        break;
    //May
    case 4:
        month = "May"
        break;
    //Jun
    case 5:
        month = "Jun"
        break;
    //Jul
    case 6:
        month = "Jul"
        break;
    //Aug
    case 7:
        month = "Aug"
        break;
    //Sep
    case 8:
        month = "Sep"
        break;
    //Oct
    case 9:
        month = "Oct"
        break;
    //Nov
    case 10:
        month = "Nov"
        break;
    //Dec
    case 11:
        month = "Dec"
        break;
}

timeStampBasic = month + " " + day + ", " + year;
dateInputBasic.value = timeStampBasic;