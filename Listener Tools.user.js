// ==UserScript==
// @name         Listener Tools
// @license      MPL-2.0
// @namespace    https://www.7cups.com/@AmicableBruda
// @version      0.2
// @description  Listener improvements for the 7cups.com chat interface.
// @author       AmicableBruda
// @match        https://www.7cups.com/*/connect/conversation*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

/*
DISCLAIMER
I'm not affiliated with 7 Cups in any official capacity and 7 Cups has NOT approved me or this code for use on their website.

This code is licensed under the MPL 2.0 open source license.
*/

// uncomment this line to delete the stored socials & resources on script load (recomment to stop deleting them on script load)
//GM_deleteValue("lt-social"); GM_deleteValue("lt-resource");

var resourceLinks = [
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
.lt-dropbtn {
  width: 25px;
  border-radius:8px;
  background: white;
  border: 1px outset #0275d8;
  font-weight: bold;
  font-size: 12px;
  color: #0275d8;
}

#lt-resources .lt-dropbtn {
  margin-top: 3px;
}
#lt-socials .lt-dropbtn {
  margin-top: 0px;
}

.lt-dropdown {
  position: absolute;
  display: inline-block;
  z-index:1;
  margin-left: 4px;
  margin-top: 2px;
}

.lt-dropdown-content {
  display: none;
  position: absolute;
  min-width: 320px;
  max-height: 400px;
  border: 1px solid #1e90fe;
  border-radius: 10px;
  background: white;
  padding: 10px;
  z-index: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
#lt-social-input-box {
  width:225px;
  margin-bottom: 5px;
}
#lt-resource-input-box {
  width:240px;
  margin-bottom: 5px;
}

#lt-resources {
  top: 20px;
}

#lt-resources .lt-dropdown-content {
  left: 0px;
  bottom: 20px;
}

#lt-socials .lt-dropdown-content {
  left: 0px;
  bottom: 20px;
}

.lt-dropdown-content a { margin: 0px; }
.lt-dropdown:hover .lt-dropdown-content .lt-dropdown .lt-dropdown-content {
  display: none;
}
.lt-dropdown:hover .lt-dropdown-content .lt-dropdown:hover .lt-dropdown-content {
  display: block;
}
.lt-dropdown:hover .lt-dropdown-content {
  display: inline-block;
  bottom: 0px;
}
`);

var socials = GM_getValue("lt-social");
if (socials === undefined) {
    socials = [];
    socials.push("Welcome to 7 Cups. I'm glad you are here.");
    socials.push("Hello! How are you?");
    let json = JSON.stringify(socials);
    if (json) {
        GM_setValue("lt-social", json);
    } else {
        console.log("Error creating social JSON.");
    }
} else {
    socials = JSON.parse(socials);
}

var resources = GM_getValue("lt-resource");
if (resources === undefined) {
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

function newDropdown(title, content) {
    let dropdown = document.createElement("div");
    let dropBtn = document.createElement("button");
    dropdown.setAttribute("class", "lt-dropdown");
    dropBtn.setAttribute("class","lt-dropbtn");
    dropBtn.innerHTML = title;
    content.setAttribute("class","lt-dropdown-content");
    dropdown.appendChild(dropBtn);
    dropdown.appendChild(content);
    return dropdown;
}

function makeClickList(itemClass, inputClass, placeholder, arr) {
    let list = document.createElement("div");
    list.appendChild(newInputForm(inputClass, placeholder));
    for (var i = 0; i < arr.length; i++) {
        var a = document.createElement("a");
        a.setAttribute("href","#");
        a.setAttribute("class", itemClass);
        a.setAttribute(itemClass, arr[i]);
        a.setAttribute("title", arr[i]);
        a.innerHTML = arr[i].replace("https://www.7cups.com/", "").replace("/", "").substring(0,43);
        list.appendChild(a);
        list.appendChild(document.createElement("br"));
    }
    return list;
}

function newInputForm(id, placeholder) {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let save = document.createElement("button");
    form.setAttribute("id", id+"-form");
    input.setAttribute("id", id+"-box");
    input.setAttribute("placeholder", placeholder);
    save.setAttribute("id", id+"-save");
    save.setAttribute("onclick", "return false;");
    save.innerHTML = "+";
    form.appendChild(input);
    form.appendChild(save);
    return form;
}

function storeItem(listKey, itemText) {
    let json = GM_getValue(listKey);
    let storedList = JSON.parse(json);
    let newList = []; newList.push(itemText);
    storedList.forEach(function(elem) {
        newList.push(elem);
    });
    GM_setValue(listKey, JSON.stringify(newList));
}

function addClickEvent(itemClass, elem) {
    let func = function () {
        document.querySelector("#chatForm textarea#Comment").value = this.getAttribute(itemClass);
    };
    elem.addEventListener("click", func);
}

function updateClickEvents(menuId, attribName) {
    let links = document.querySelectorAll(menuId+" .lt-dropdown-content a");
    let func = function () {
        document.querySelector("#chatForm textarea#Comment").value = this.getAttribute(attribName);
    };
    links.forEach(function (elem) {
        elem.addEventListener("click", func);
    });
}

function addSaveEvent(elem, className) {
    elem.addEventListener("click", function() {
        let input = document.getElementById(className+"-input-box");
        let value = input.value;
        if (value.length > 0) {
            storeItem("lt-social", value);
            var a = document.createElement("a");
            var br = document.createElement("br");
            a.setAttribute("href","#");
            a.setAttribute("class", className);
            a.setAttribute(className, value);
            a.setAttribute("title", value);
            a.innerHTML = value.replace("https://www.7cups.com/", "").replace("/", "").substring(0,43);
            addClickEvent(className, a);
            let content = input.parentNode.parentNode;
            content.insertBefore(br, content.childNodes[1]);
            content.insertBefore(a, content.childNodes[1]);
        }
    });
}

(function() {
    'use strict';
    var chatForm = document.getElementById("chatForm");
    var parent = chatForm.parentNode;

    var socialMenu = newDropdown("S", makeClickList("lt-social", "lt-social-input", "Add a new social text here", socials));
    socialMenu.setAttribute("id","lt-socials");
    parent.insertBefore(socialMenu, chatForm);
    updateClickEvents("#lt-socials", "lt-social");
    let socialSave = document.getElementById("lt-social-input-save");
    addSaveEvent(socialSave,"lt-social");

    var resourceMenu = newDropdown("R", makeClickList("lt-resource", "lt-resource-input", "Add a new 7 Cups resource url here", resources));
    resourceMenu.setAttribute("id","lt-resources");
    parent.insertBefore(resourceMenu, chatForm);
    updateClickEvents("#lt-resources", "lt-resource");
    let resourceSave = document.getElementById("lt-resource-input-save");
    addSaveEvent(resourceSave,"lt-resource");
})();
