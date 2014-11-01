#!/usr/bin/env node

var pjson = require('./package.json');
var version = pjson.version;

if (process.argv.length <= 2) {
  console.log(["press_release", version].join(" "));
  console.log("");
  console.log("USAGE:");
  console.log("    press_release <text to translate>");
  process.exit(0);
}

var key = "AIzaSyDTm2Ng0-BSLscM5pI8nbOfki4AzFyNeK0";
var source = 'en';
var target;
var text = process.argv.slice(2).join(" ");

console.log(text);

get_languages = function(callback) {
  var all_languages = [];
  var request = require("request"); 
  var result = request("https://www.googleapis.com/language/translate/v2/languages?key=AIzaSyDTm2Ng0-BSLscM5pI8nbOfki4AzFyNeK0", function(error, response, body) {
    json = JSON.parse(body);
    languages = json['data']['languages']
    for(var i in languages) {
      all_languages.push(languages[i]['language']);
    }
    callback(all_languages);
  });
  return all_languages;
}

translate = function(source, target, callback) {
  var request = require("request");
  var url = ["https://www.googleapis.com/language/translate/v2?key=", key, "&source=", source, "&target=", target, "&q=", text]
  var result = request(url.join(""), function(error, response, body) {
    json = JSON.parse(body);
    translations = json['data']['translations'];
    var translation = translations[0]['translatedText'];
    callback(translation);
  });
  return(result);
}

get_languages(function(languages) {
  for (i in languages) {
    var language = languages[i];
    if (language == "en") continue;
    translate(source, language, function(translation) {
      console.log(translation);
    });
  }
});

