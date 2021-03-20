var submitbtn = document.querySelector("#todosubmit");
var todofield = document.querySelector("#todotask");
var list = document.querySelector("#todocontainer");

submitbtn.addEventListener("click", function() {
    var inputfield = document.createElement("h2");
    var edit = document.createElement("button");
    var checktask = document.createElement("input");
    var deletebtn = document.createElement("button");
    var inputtext = document.createElement("label");
    checktask.setAttribute("type", "checkbox");
    checktask.classList.add("checkbox_btn");
    checktask.id = "c1";
    inputtext.innerHTML = todofield.value;
    edit.innerHTML = "Edit";
    inputtext.classList.add("todos");
    inputtext.setAttribute("for", "c1");
    deletebtn.innerHTML = "-";
    todofield.value = "";
    inputfield.append(checktask);
    inputfield.append(inputtext);
    inputfield.append(edit);
    inputfield.append(deletebtn);
    list.append(inputfield);
    deletebtn.addEventListener("click", function() {
        inputfield.remove();
    });
    edit.addEventListener("click", function() {
        edit.hidden = true;
        checktask.hidden = true;
        inputtext.hidden = true;
        inputtext.innerHTML = "";
        var changebtn = document.createElement("button");
        var change_text = document.createElement("input");
        change_text.setAttribute("type", "text");
        change_text.classList.add("todostext");
        inputfield.insertBefore(changebtn, edit);
        inputfield.insertBefore(change_text, inputfield.firstElementChild);
        changebtn.innerHTML = "Change";
        console.log(changebtn);
        changebtn.addEventListener("click", function() {
            inputtext.innerHTML = change_text.value;
            edit.hidden = false;
            checktask.hidden = false;
            inputtext.hidden = false;
            changebtn.remove();
            change_text.remove();
            console.log("added new input");
        });
    });
});