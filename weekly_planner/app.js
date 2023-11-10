// JavaScript file by Aahanaa Tibrewal! (Github:Atibrewa)
// Credit to soulai for helping me solve my bug with buttons not working! -> the sol was to add type='button' to keep it from refreshing the page :)

// Adding a top and bottom border!
var body = document.getElementsByTagName("body")[0]
body.insertBefore(borderImgs(40, ["Bean.webp"]), body.firstChild);
body.appendChild(borderImgs(20, ["Cup1.png", "Cup2.png"]));

// Setup - make form, deteoption for events etc!
makeform();
makeDeleteOption();
var formDOM = document.getElementById("add_event_form");
var delDOM = document.getElementById("event-delete");
var curEvent;

// ---------------------- ALL EVENT LISTENERS ------------------------------

// EventListener for the Add new event button - it makes the form visible!
document.getElementById("new_event_button").addEventListener("click", function(){
    formDOM.style = "display:show";
});

// EventListener for the submit button on the form - it calls a function that checks the inputs and creates an event with them :)
document.getElementById("submit_button").addEventListener("click", function(){
    takeInput();
})

// EventListener for the cancel button ont he form that hides the form
document.getElementById("cancel_button").addEventListener("click", function(){
    formDOM.firstChild.reset();
    formDOM.style = "display:none";
})

// Onclick, it calls a function to delete the event (gasp, the horror!)
document.getElementById("delete_button").addEventListener("click", function(){
    deleteEvent(curEvent);
    delDOM.style = "display:none";
});

// Hides the delete event option when cancel is clicked
document.getElementById("cancel_delete").addEventListener("click", function(){
    delDOM.style = "display:none";
});


// ---------------------- MAIN/MAJOR METHODS ------------------------------
class EventItem {
    constructor(name, location, day, startTime, endTime) {
        this.name = name ? name : "Untitled";
        this.location = location ? location : "Unspecified";
        this.day = day;
        this.startTime = startTime;
        this.endTime = endTime;
        this.duration = endTime-startTime;
        this.eventDiv = this.createEvent();
        this.fitToColumn(this.eventDiv);
    }

    createEvent(){
        // Create the div tag for an event
        let eventDiv = document.createElement("div");
        eventDiv.className = "event-item";
    
        // Creating the matter to go into the event box!
        let innerMatter = "<strong>" + this.name + "</strong><br>" + this.location + "</br>" + convertToTime(this.startTime) + "-" + convertToTime(this.endTime);
        eventDiv.innerHTML = innerMatter;

        // add eventlistener to open delete options!
        eventDiv.addEventListener("click", function(){
            document.getElementById("event-delete").style = "display:show";
            curEvent = eventDiv;
        });

        return eventDiv;
    }

    fitToColumn(eventDiv){
        // Style for row and height 
        // The total height of the cols is 500px, so I use 21px per hour as a standard
        eventDiv.style.top = (this.startTime * 21)+ "px";
        eventDiv.style.height = (this.duration * 21)+"px";

        // Adding it to the right col!
        let colContents = document.getElementsByClassName("content");
        let col = colContents[this.day];
        col.appendChild(eventDiv);
    }
}

// Checks to make sure the end time is after start time and creates an event corresponding to the values inputed in the form
function takeInput(){
    // Retrieving the form for easy access!
    let formInput = document.forms["EventForm"];
    
    // Checking the inputs
    if (Number(formInput["endTime"].value) <= Number(formInput["startTime"].value)){
        alert("Oops! End Time cannot be before or during the Start Time :(");
    } else {
        // Creates an EventItem
        new EventItem(formInput["name"].value, formInput["location"].value, formInput["day"].value, formInput["startTime"].value, formInput["endTime"].value);
        // Hide and reset form :)
        document.getElementById("add_event_form").style = "display:none";
        formInput.reset();
    }
}

// Makes a form and adds all is subelements to the HTML file!
function makeform(){
    // The tag for the form to go in
    var divForForm = document.getElementById("add_event_form");

    // The form itself
    var inputForm = document.createElement("form");
    inputForm.name = "EventForm";
    inputForm.id = "inputForm";

    // Name
    var nameIn = document.createElement("input");
    nameIn.type = "text";
    nameIn.name = "name";
    nameIn.placeholder = "Name";

    // Location
    var location = document.createElement("input");
    location.type = "text";
    location.name = "location";
    location.placeholder = "Location"

    // Day
    var day = document.createElement("select");
    day.type = "select";
    day.name = "day";
    day.innerHTML = generateDayOptions();

    // Generating the time options!
    let options = GenerateTimeOptions();

    // Start Time
    var startTime = document.createElement("select");
    startTime.type = "select";
    startTime.name = "startTime";
    startTime.innerHTML = options;

    // End Time
    var endTime = document.createElement("select");
    endTime.type = "select";
    endTime.name = "endTime";
    endTime.innerHTML = options;

    // Submit Button
    var submitButton = document.createElement("button");
    submitButton.type = "button"
    submitButton.id = "submit_button";
    submitButton.innerHTML = "Submit!";

    // Cancel Button
    var cancelButton = document.createElement("button");
    cancelButton.type = "button"
    cancelButton.id = "cancel_button";
    cancelButton.innerHTML = "Cancel :(";

    // Adding everything to the form
    inputForm.appendChild(generateLabel("Name:"));
    inputForm.appendChild(nameIn);
    inputForm.appendChild(generateLabel("Location:"));
    inputForm.appendChild(location);
    inputForm.appendChild(generateLabel("Day:"));
    inputForm.appendChild(day);
    inputForm.appendChild(generateLabel("Start:"));
    inputForm.appendChild(startTime);
    inputForm.appendChild(generateLabel("End:"));
    inputForm.appendChild(endTime);
    inputForm.appendChild(submitButton);
    inputForm.appendChild(cancelButton);

    // add the form to its tag :)
    divForForm.appendChild(inputForm);
}

// Makes a div tag and adds delete/cancel buttons
function makeDeleteOption(){
    let body = document.getElementsByTagName("body")[0];
    // Making a tag for these options - will be styled similar to the event form
    let deleteOpt = document.createElement("div");
    deleteOpt.id = "event-delete";
    deleteOpt.style = "display:none";

    // Delete button
    let delButton = document.createElement("button");
    delButton.type = "button";
    delButton.id = "delete_button"
    delButton.innerHTML = "Yes, delete";

    // Cancel Button
    let cancelButton = document.createElement("button");
    cancelButton.type = "button"
    cancelButton.id = "cancel_delete";
    cancelButton.innerHTML = "No, keep";

    // adding everything to the DOM
    deleteOpt.appendChild(generateLabel("Do you want to delete this event?"));
    deleteOpt.appendChild(delButton);
    deleteOpt.appendChild(cancelButton);
    body.appendChild(deleteOpt);
}

// ---------------------- HELPER METHODS ------------------------------
// These methods generate text parts or help in some way that makes the main methods shorted and easier to look at :)

// Returns a string with HTML option tags created for a form select element in the format "<option value="1">Monday</option> and so on
function generateDayOptions(){
    text = ""
    days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (d in days) {
        text += "<option value='" + d + "'>"+ days[d] +"</option>"
    }
    return text;
}

// Returns an array of strings in the format "12:00AM" and so on until "11:45PM"
function generateTimes(){
    arrayOfTimes = []
    for (let i=0; i<96; i++) {
        //  Calculating the time
        let hours = Math.floor(i/4);
        let minutes = (i%4) * 15;
        let ToD = "AM";

        // Checking edge cases such as 0 am and 1:0 minutes
        if (hours >= 12) {
            hours = hours-12;
            ToD = "PM";
        } if (hours == 0) {
            hours = "12";
        } if (minutes == 0) {
            minutes = "00";
        }

        // Combining and adding to Array!
        t = "" + hours + ":" + minutes + ToD 
        arrayOfTimes.push(t)
    }
    return arrayOfTimes;
}

// Returns a string with HTML option tags created for a form select element in the format "<option value="0.0">12:00AM</option>
function GenerateTimeOptions(){
    arrayOfTimes = generateTimes();
    let text = "";
    for (i in arrayOfTimes){
        text += "<option value='"+ i/4 + "'>" + arrayOfTimes[i] + "</option>";
    }
    return text;
}

// Returns a label tag with the given input as the innerText
function generateLabel(labelText){
    let label = document.createElement("label");
    label.innerHTML = labelText;
    return label;
}

// Takes input of ints 0.0, 0.25, 0.5 and so on and returns 12:00AM, 12:15AM, and so on
function convertToTime(intValue){
    ToD = "AM"
    let hours = Math.floor(intValue);
    let minutes = (intValue - hours) * 60; 

    if (hours > 12){
        hours = hours - 12;
        ToD = "PM"
    } if (hours == 0){
        hours = 12;
    } if (minutes == 0) {
        minutes = "00";
    }

    return (hours + ":" + minutes + ToD);
}

// Removes an event from the DOM (this method can be added onto and event can be removed from memory if/when that func is added)
function deleteEvent(eventTag){
    eventTag.outerHTML = "";
}

// ---------------------- STYLING & IMAGES ------------------------------

// Creates a div element with n repeats of the images whose paths are given in the array paths
function borderImgs(n, paths){
    var borders = document.createElement("div");
    borders.className = "borderImgs";
    borders.style.textAlign = "center";

    for (let i=0; i<n; i++){
        paths.forEach(img => {
            var pic = document.createElement("img");
            pic.src = img;
            pic.alt = "";
            pic.style.maxWidth = "2.5%";
            borders.appendChild(pic);
        });
    }

    return borders;
}