var locale = require('com.shareourideas.locale');
var configFile = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "config.json");
var config = JSON.parse(configFile.read().text);
configFile = null;

if (config.lang.ar === 'true' && config.lang.en === 'true') {
  Alloy.Globals.ar = true;
  Alloy.Globals.en = true;
  Alloy.Globals.currentLang = Titanium.App.Properties.getString('lang', Titanium.Locale.currentLanguage);
} else if (config.lang.ar === 'true' && config.lang.en === 'false') {
  Alloy.Globals.ar = true;
  Alloy.Globals.en = false;
  Alloy.Globals.currentLang = Titanium.App.Properties.getString('lang', 'ar');
} else if (config.lang.en === 'true' && config.lang.ar === 'false') {
  Alloy.Globals.en = true;
  Alloy.Globals.ar = false;
  Alloy.Globals.currentLang = Titanium.App.Properties.getString('lang', 'en');
}

// change lang.
locale.setLocale(Alloy.Globals.currentLang);


//Alloy.Globals.ratingbar = require('titutorial.ratingbar');
Alloy.Globals.HeaderView = function(options) {

  var self = Ti.UI.createView(_.extend({
    height: 35,
    top: 5,
  }, options.viewArgs || {}));

  var indicator = Ti.UI.createView({
    top: 0,
    //right : (options.optionWidth * (options.options.length - 1)) + '%',
    bottom: 1,
    width: options.optionWidth + '%',
    backgroundColor: 'white',
    opacity: "0.6"
  });
  if (Alloy.Globals.currentLang == 'en') // header view English version
  {
    indicator.right = (options.optionWidth * (options.options.length - 1)) + '%';
  } else {
    indicator.left = (options.optionWidth * (options.options.length - 1)) + '%';
  }
  self.add(indicator);

  var title = Ti.UI.createLabel({
    text: options.title,
    color: Alloy.Globals.HvColor,
    //left : 10,
    width: Ti.UI.SIZE,
    height: Ti.UI.SIZE,
    font: {
      fontSize: 14,
      fontWeight: "bold"
    }
  });
  if (Alloy.Globals.currentLang == 'en') // header view English version
  {
    title.left = 10;
  } else {
    title.right = 10;
  }

  self.add(title);

  function option(t, idx, lcolor) {
    var rightOffset = (options.optionWidth * (Math.abs(idx - (options.options.length - 1)))) + '%';

    var v = Ti.UI.createView({
      width: "25%",
      //right : rightOffset,
      id: t
    });

    if (Alloy.Globals.currentLang == 'en') // header view English version
    {
      v.right = rightOffset;
    } else {
      v.left = rightOffset;
    }

    var l = Ti.UI.createLabel({
      id: "tab-" + idx,
      text: t,
      color: lcolor,
      height: Ti.UI.SIZE,
      width: Ti.UI.SIZE,
      font: {
        fontSize: 12
      },
      textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER
    });

    v.add(l);

    //option selection
    v.addEventListener('click', function() {

      if (Alloy.Globals.currentLang == 'en') // header view English version
      {
        indicator.animate({
          right: rightOffset,
          duration: 250
        }, function() {
          self.fireEvent('change', {
            selection: t
          });
          l.color = "#E56227";
        });
      } else {
        indicator.animate({
          left: rightOffset,
          duration: 250
        }, function() {
          self.fireEvent('change', {
            selection: t
          });
          l.color = "#E56227";
        });
      }

    });

    return v;
  }

  var exTabs = [];
  //Create menu options for each option requested
  for (var i = 0, l = options.options.length; i < l; i++) {
    exTabs[i] = option(options.options[i], i, options.defcolors[0]);
    self.add(exTabs[i]);
  }

  //Add common shortcut to addEventListener
  self.on = function(ev, cb) {
    self.addEventListener(ev, cb);
  };

  //Shift indicator to desired index
  self.goTo = function(idx) {
    var rightOffset = (options.optionWidth * (Math.abs(idx - (options.options.length - 1)))) + '%';
    if (Alloy.Globals.currentLang == 'en') // header view English version
    {
      indicator.right = rightOffset;
    } else {
      indicator.left = rightOffset;
    }

  };

  return self;


};
Alloy.Globals.PersonRow = function(person, pid, df, data_type, dataLength, counter) {
  var self = Ti.UI.createTableViewRow({
    height: Ti.UI.SIZE,
    //height:100,
    selectedBackgroundColor: '#cdcdcd',
    className: 'personRow',
    layout: "vertical",
    pid: pid,

    //borderColor:"blue",borderWidth:1
  });
  self.personObject = person;

  var cont = Ti.UI.createView({
    height: Ti.UI.SIZE,
    width: "100%",
    //borderColor:"red",borderWidth:1
    //height:60
  });
  // person photo
  if (Alloy.Globals.currentLang == 'en') {
    cont.add(Ti.UI.createImageView({
      image: person.image,
      top: 7,
      left: 10,
      width: 70,
      height: 70,
      borderWidth: '3',
      //borderRadius:'340',
      //borderColor:'#611F53'

    }));
  } else {
    cont.add(Ti.UI.createImageView({
      image: person.image,
      top: 7,
      right: 10,
      width: 70,
      height: 70,
      borderWidth: '3',
      //borderRadius:'340',
      //borderColor:'#611F53'

    }));
  }


  var pername = Ti.UI.createLabel({
    text: person[df[data_type].heading],
    top: 5,

    height: 25,
    ellipsize: true,
    wordWrap: false,
    minimumFontSize: 14,

    color: Alloy.Globals.PersonRowConf.perNameColor,
    font: {
      fontWeight: 'bold',
      fontSize: Alloy.Globals.PersonRowConf.perNameSize + 'dp'
    }
  });
  if (Alloy.Globals.currentLang == 'en') {
    pername.right = null;
    pername.left = 90;
  } else {
    pername.right = 90;
  }
  // person name
  cont.add(pername);

  if (person[df[data_type].subheading] !== undefined) {
    // person job
    var perjob = Ti.UI.createLabel({
      html: "<i>" + person[df[data_type].subheading] + "</i>",
      top: 35,
      //right:90,
      //right:0,
      //height:18,
      height: Ti.UI.SIZE,
      ellipsize: true,
      //wordWrap:false,
      minimumFontSize: 12,
      color: Alloy.Globals.PersonRowConf.perjobColor,
      font: {
        fontSize: Alloy.Globals.PersonRowConf.perjobSize + 'dp',
        fontWeight: "bold"
      },

    });

    if (Alloy.Globals.currentLang == 'en') {

      perjob.left = 90;
    } else {
      perjob.right = 90;
    }
    cont.add(perjob);
  }

  self.add(cont);
  var sbar = Ti.UI.createView({
    width: "80%",
    left: "10%",
    backgroundColor: Alloy.Globals.PersonRowConf.sbarColor,
    height: 1,
    top: 10
  });

  if (counter < dataLength - 1)
    self.add(sbar);


  return self;
};

Alloy.Globals.APIURL = config.APIURL;
Alloy.Globals.NotificationsURL = config.NotificationsURL;
Alloy.Globals.HbColor = config.HbColor;
Alloy.Globals.Home = config.home;
Alloy.Globals.schedule = config.schedule;
Alloy.Globals.HvColor = config.HvColor;
Alloy.Globals.ThemeColor = config.ThemeColor;
Alloy.Globals.scheduleDetails = config.scheduleDetails;
Alloy.Globals.PersonRowConf = config.PersonRow;
Alloy.Globals.personDetails = config.personDetails;
Alloy.Globals.sponsors = config.sponsors;
Alloy.Globals.sponsors = config.sponsors;
Alloy.Globals.twitter = config.twitter;
Alloy.Globals.menuConf = config.menuConf;
Alloy.Globals.Menu = [];
for (var i = 0; i < config.menu.length; i++) {
  Alloy.Globals.Menu.push({
    title: L(config.menu[i]),
    abtitle: L(config.menu[i]),
    controller: config.menu[i],
    icon: "/img/icons/" + config.menu[i] + ".png"
  });
}

Alloy.Globals.Tabs = [];
for (var i = 0; i < config.tabs.length; i++) {
  Alloy.Globals.Tabs.push({
    title: L(config.tabs[i]),
    abtitle: L(config.tabs[i]),
    controller: config.tabs[i],
    icon: "/img/icons/" + config.tabs[i] + ".png"
  });
}




Alloy.Globals.isDebug = true;
Alloy.Globals.Log = function(message) {
  if (Alloy.Globals.isDebug) {
    Ti.API.info(message);
  }
};
