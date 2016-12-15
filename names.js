var names = {};

names.nameList = [
    "❤│Zero",
	"Z3RO AGAR YT",
	"TRAPPY MY WIFE",
	"XDDDDDDDDDDD",
	"IPIXELSA<3"

];

names.getRandomName = function() {
    return names.nameList[Math.floor((Math.random() * names.nameList.length))];
};

module.exports = names;
