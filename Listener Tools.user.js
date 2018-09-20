// ==UserScript==
// @name         Listener Tools
// @license      MPL-2.0
// @namespace    https://github.com/AmicableBruda/7cups
// @supportURL   https://github.com/AmicableBruda/7cups/issues
// @updateUrl    https://github.com/AmicableBruda/7cups/raw/master/Listener%20Tools%20Update.user.js
// @downloadURL  https://github.com/AmicableBruda/7cups/raw/master/Listener%20Tools.user.js
// @version      0.4
// @description  Listener improvements for the 7cups.com chat interface.
// @author       AmicableBruda
// @match        https://www.7cups.com/*/connect/conversation*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
DISCLAIMER
I'm not affiliated with 7 Cups in any official capacity and 7 Cups has NOT approved me or this code for use on their website.

This code is licensed under the MPL 2.0 open source license.
*/

var resourceLinks = [
    "http://suicide.org/",
    "https://www.7cups.com/12-step-working-guide/",
    "https://www.7cups.com/7cups-for-the-searching-soul/",
    "https://www.7cups.com/adhd/",
    "https://www.7cups.com/act-therapy-techniques/",
    "https://www.7cups.com/alcohol-drug-abuse/",
    "https://www.7cups.com/anxiety-help/",
    "https://www.7cups.com/managing-bipolar/",
    "https://www.7cups.com/boundaries/",
    "https://www.7cups.com/breakup-advice/",
    "https://www.7cups.com/bullying/",
    "https://www.7cups.com/chronic-pain/",
    "https://www.7cups.com/how-to-adjust-to-college-life/",
    "https://www.7cups.com/schizophrenia-listeners/",
    "https://www.7cups.com/depression-help-online/",
    "https://www.7cups.com/diabetes-cbt/",
    "https://www.7cups.com/eating-disorder-help/",
    "https://www.7cups.com/how-to-get-motivated-to-exercise/",
    "https://www.7cups.com/family-stress/",
    "https://www.7cups.com/managing-finances/",
    "https://www.7cups.com/forgiveness/",
    "https://www.7cups.com/getting-unstuck/",
    "https://www.7cups.com/grief/",
    "https://www.7cups.com/how-to-deal-with-loneliness/",
    "https://www.7cups.com/help-managing-emotions/",
    "https://www.7cups.com/ocd/",
    "https://www.7cups.com/panic-attacks-help-online/",
    "https://www.7cups.com/online-parenting-course/",
    "https://www.7cups.com/ypoc-guide/",
    "https://www.7cups.com/perinatal-support-listeners/",
    "https://www.7cups.com/psychological-first-aid/",
    "https://www.7cups.com/self-harm/",
    "https://www.7cups.com/sleeping-well/",
    "https://www.7cups.com/social-anxiety/",
    "https://www.7cups.com/startup-support/",
    "https://www.7cups.com/domestic-assault-survivor/",
    "https://www.7cups.com/how-to-overcome-test-taking-anxiety/",
    "https://www.7cups.com/traumatic-experience-help/",
    "https://www.7cups.com/weight-management/",
    "https://www.7cups.com/work-related-stress/"
];

GM_addStyle(`
.lt-social-dropbtn, .lt-resource-dropbtn {
width: 25px;
border-radius:8px;
background: white;
border: 1px outset #0275d8;
font-weight: bold;
font-size: 12px;
color: #0275d8;
margin-top: 0px
}

.lt-resource-dropbtn {}

.lt-resource-dropdown {
top: 23px;
}

.lt-social-dropdown, .lt-resource-dropdown {
z-index:1;
margin-left: 4px;
margin-top: 2px;
}

.lt-social-dropdown-content, .lt-resource-dropdown-content {
min-width: 320px;
max-height: 400px;
border: 1px solid #1e90fe;
border-radius: 10px;
background: white;
padding: 10px;
z-index: 2;
overflow-x: hidden;
overflow-y: auto;
left: 0px;
bottom: 0px;
}

#lt-social-input {
width:225px;
margin-bottom: 5px;
}

#lt-resource-input {
width:240px;
margin-bottom: 5px;
}
`);

// load stored socials or defaults
function loadSocials() {
    let socials = GM_getValue("lt-social");
    if (socials === undefined) {
        socials = [];
        socials.push("Hello! How are you?");
        socials.push("Hello! How is everyone?");
        socials.push("Welcome to 7 Cups! How are you?");
        let json = JSON.stringify(socials);
        if (json) {
            GM_setValue("lt-social", json);
        } else {
            console.log("Error creating social JSON.");
        }
    } else {
        socials = JSON.parse(socials);
    }
    return socials;
}

// load stored resources or defaults
function loadResources() {
    let resources = GM_getValue("lt-resource");
    if (resources === undefined) {
        resources = [];
        resources = resourceLinks;
        let json = JSON.stringify(resources);
        if (json) {
            GM_setValue("lt-resource", json);
        } else {
            console.log("Error creating resources JSON");
        }
    } else {
        resources = JSON.parse(resources);
    }
    return resources;
}

/*
ClickList object constructor

A list of elements that insert their string content into the chat input box when clicked.

itemClass - specifice the css class used for the items.
items - array of strings
titleCreator - a function that takes one argument 'string' and is called on each item to create the link text displayed in the html list.
    'string' contains the item's full string.
*/
function ClickList(itemClass, items, titleCreator) {
    let ob = this;
    let func = function() {
        document.querySelector("#chatForm textarea#Comment").value = this.getAttribute("string");
    }
    ob.itemClass = itemClass;
    ob.newItem = function (string) {
        let a = document.createElement("a");
        a.setAttribute("href", "#");
        a.setAttribute("class", ob.itemClass);
        a.setAttribute("string", string);
        a.setAttribute("title", string);
        a.innerHTML = ob.createTitle(string); //todo: add string replace for web urls
        a.addEventListener("click", func);
        return a;
    }
    ob.createTitle = titleCreator;
    ob.append = function (string) {
        let item = ob.newItem(string);
        ob.element.appendChild(item);
        ob.element.appendChild(document.createElement("br"));
    }
    ob.prepend = function (string) {
        let item = ob.newItem(string);
        ob.element.insertBefore(document.createElement("br"), ob.element.childNodes[0]);
        ob.element.insertBefore(item, ob.element.childNodes[0]);
    }
    ob.element = document.createElement("div");
    for (let i = 0; i < items.length; i++) {
        ob.append(items[i]);
    }
}

/*
SaveForm object constructor

An input form used to add new strings to an existing clickList and stored string array.

id - CSS id used in form html elements (example-form, example-input, example-button)
placeholder - Text to display as placeholder in html input box.
clickList - The clickList that this form saves to.
*/
function SaveForm(id, placeholder, clickList) {
    let ob = this;
    ob.id = id;
    ob.list = clickList;
    ob.save = function () {
        let text = ob.input.value;
        ob.list.prepend(text);
        let json = GM_getValue(ob.id), storedList = JSON.parse(json);
        let newList = []; newList.push(text);
        storedList.forEach(function(elem) {
            newList.push(elem);
        });
        GM_setValue(ob.id, JSON.stringify(newList));
    };
    ob.element = document.createElement("form");
    ob.input = document.createElement("input");
    ob.button = document.createElement("button");
    ob.element.setAttribute("id", `${id}-form`);
    ob.input.setAttribute("id", `${id}-input`);
    ob.input.setAttribute("placeholder", placeholder);
    ob.button.setAttribute("id", `${id}-button`);
    ob.button.setAttribute("onclick", "return false;");
    ob.button.innerHTML = "+";
    ob.button.addEventListener("click", ob.save)
    ob.element.appendChild(ob.input);
    ob.element.appendChild(ob.button);
}

/*
HoverMenu object constructor

A hover menu that displays its content on mouseover.

id - CSS id used for the menu and to customize the CSS class of child elements (example-dropbt, example-dropdown, example-dropdown-content).
title - Text used for elements menu button.
*/
function HoverMenu(id, title) {
    let ob = this;
    ob.id = id;
    ob.title = title;
    ob.button = document.createElement("button");
    ob.button.setAttribute("class", `${id}-dropbtn`);
    ob.button.style.position = "absolute";
    ob.button.innerHTML = this.title;
    ob.content = document.createElement("div");
    ob.content.setAttribute("class", `${id}-dropdown-content`);
    ob.content.style.position = "absolute";
    ob.content.style.display = "none";
    ob.element = document.createElement("div");
    ob.element.setAttribute("class", `${id}-dropdown`);
    ob.element.style.position = "absolute";
    ob.element.style.display = "inline-block";
    ob.element.appendChild(this.button);
    ob.element.appendChild(this.content);
    ob.element.addEventListener("mouseover", function() {
        ob.content.style.display = "block";
    });
    ob.element.addEventListener("mouseout", function() {
        ob.content.style.display = "none";
    });
}

var socials = loadSocials();
var resources = loadResources();

(function() {
    'use strict';
    var sTitleFunc = function (string) {
        return string.substring(0, 43);
    }
    var socialList = new ClickList("click-item", socials, sTitleFunc);
    var socialMenu = new HoverMenu("lt-social", "S"), socialSave = new SaveForm("lt-social", "Add new social comment here", socialList);
    GM_registerMenuCommand("Reset Socials", function() { // register option in Tampermonkey menu for deleting stored socials
        if (confirm("Reset Socials to default?")) {
            GM_deleteValue("lt-social");
            socials = loadSocials();
            socialList = new ClickList("click-item", socials, sTitleFunc);
            let newSave = socialSave = new SaveForm("lt-social", "Add new social comment here", socialList);
            socialMenu.content.innerHTML = "";
            socialMenu.content.appendChild(newSave.element);
            socialMenu.content.appendChild(socialList.element);
        }
    }, "S");
    var rTitleFunc = function (string) {
        return string.replace(/^https:\/\/www.7cups.com\//, "").replace(/\/$/, "").substring(0, 43);
    }
    var resourceList = new ClickList("click-item", resources, rTitleFunc);
    var resourceMenu = new HoverMenu("lt-resource", "R"), resourceSave = new SaveForm("lt-resource", "Add new resource link here", resourceList);
    GM_registerMenuCommand("Reset Resources", function() { // register option in Tampermonkey menu for deleting stored Resources
        if (confirm("Reset Resources to default?")) {
            GM_deleteValue("lt-resource");
            resources = loadResources();
            let resourceList = new ClickList("click-item", resources, rTitleFunc);
            let newSave = new SaveForm("lt-resource", "Add new resource link here", resourceList);
            resourceMenu.content.innerHTML = "";
            resourceMenu.content.appendChild(newSave.element);
            resourceMenu.content.appendChild(resourceList.element);
        }
    }, "R");
    var chatForm = document.getElementById("chatForm"), parent = chatForm.parentNode;
    socialMenu.content.appendChild(socialSave.element);
    socialMenu.content.appendChild(socialList.element);
    parent.insertBefore(socialMenu.element, chatForm);
    resourceMenu.content.appendChild(resourceSave.element);
    resourceMenu.content.appendChild(resourceList.element);
    parent.insertBefore(resourceMenu.element, chatForm);
})();