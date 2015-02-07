function scorecard(abc){
  
  
	var pubScores = "<table>";
  
  pubScores += "<tr><td>Hole</td><td>Pub</td><td>Drink</td><td>Par</td><td>Drink</td></tr>";


for(i = 0; i < abc.pubs.length; i++){
    var pub = abc.pubs[i];
    console.log(pub.Name);
	pubScores += 
	"<tr> <td>"+(i+1)+"</td><td>"+pub.Name+"</td><td>"+pub.Drink+"</td><td>"+pub.Par+"</td><td></td></tr>";
}

  pubScores += "</table>";
  
  $('#mydivtag').html(pubScores);

}