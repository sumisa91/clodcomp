var last = '';
var timeOut;
var items = [];

function getTweets(id){
		$.getJSON("Server.php?start="+id,
		function(data){
				$.each(data, function(count,item){
						addNew(item);
						last = item.id;
				});
		});
                
}

function getChart(id){
		$.getJSON("Chart.php?start="+id,
		function(data){
				$.each(data, function(key,val){
						items.push(val);
				});
		});
}

function loadChart(id){
    $.ajax({
        url: 'https://www.google.com/jsapi?callback',
        cache: true,
        dataType: 'script',
        success: function(){
          google.load('visualization', '1', {packages:['corechart'], 'callback' : function()
            {

                  $.ajax({
                       type: "POST",
                       dataType: "json",
                       data: {id: id},
                       url: '<?=URL?>' + 'ajaxlibrary/get-charts',
                       success: function() {
                          var data = google.visualization.DataTable();
                          data.addColumn('string', 'Sentiment');
                          data.addColumn('number', 'Count');
                          data.addRows([
                            ['Positive', items[0]],
                            ['Negative', items[1]],
                            ['Neutral', items[2]]
                          ]);

                          var options = {title: 'Sentiment by Percent'};

                          var chart = new google.visualization.PieChart(document.getElementById('chart1'));
                          chart.draw(data, options);
                       }
                  });
            }});
            return true;
        }
    });
}

function addNew(item){
		if($('#tweets div.tweet').length>9){ //If we have more than nine tweets
				$('#tweets div.tweet:first').toggle(300);//remove it form the screen
				$('#tweets div.tweet:first').removeClass('tweet');//and it's class
				$("#tweets div:hidden").remove(); //sweeps the already hidden elements
		}
		$('#tweets').append(renderTweet(item, 'hidden'));
}

function renderTweet(item){
		importanceColor=getImportanceColor(item.followers_count);
                sentimentColor=getSentimentColor(item.sentiment);
		return '<div class="tweet" id="'+item.id+'">'+
                        '<img src="' + item.profile_image_url + '">' +
                
		'<strong><a href="http://twitter.com/'+item.screen_name+'" style="color:'+importanceColor+'">'+
		item.screen_name+'</a></strong><span class="text">'+
		item.text
		+'</span><span class="created_at"><br /><a href="http://twitter.com/'+
		item.screen_name+'/status/'+item.id+'">'+
		item.created_at+'</a></span>'+ '<span class="sentiment"><br /><br /><b>Sentiment Analysis: </b><p style="color:'+sentimentColor+'">'+item.sentiment+'</p></span></div>';
}

function getImportanceColor(number){
		rgb = 255-Math.floor(16*(Math.log(number+1)+1)); //should return about 0 for 0 followers and 255 for 4million (Ashton Kutchner? Obama?)
		return 'rgb('+rgb+',0,0)';
}

function getSentimentColor(text){
		if(text === "positive") {
                    color="green";
                } else if (text === "negative") {
                    color="red";
                } else if (text === "neutral") {
                    color="grey";
                } else {
                    color="black";
                }
                return color;
}

function poll(){
		timeOut = setTimeout('poll()', 800);//It calls itself every 200ms
		getTweets(last);
                getChart(last);
                loadChart(last);
}

$(document).ready(function() {
		poll();		
});
