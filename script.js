var accessToken = "62d0232f3d824bc8ba75edfc4d10e7d6";
var baseUrl = "https://api.dialogflow.com/v1/";
$(document).ready(function() {
    $("#input").keypress(function(event) {
        if (event.which == 13) {
            event.preventDefault();
            kirim_data();
        }
    });
    $("#rec").click(function(event) {
        rubahRekaman();
    });
    $("#main").click(function(event){
        var txt = $("#response").val();
        responsiveVoice.speak(txt, "Indonesian Male");
    });
});
if(!('webkitSpeechRecognition' in window)){
    alert("Maaf, peramban anda tidak mendukung fitur speech-to-text pada aplikasi ini");
}
var recognition;
function rekam(){
recognition = new webkitSpeechRecognition();
recognition.onresult = function(event){
    var text ="";
    for(var i = event.resultIndex; i < event.results.length; i++){
        text += event.results[i][0].transcript;
    }
    setTeks(text);
    stopRekam();
};
recognition.onend = function(){
    stopRekam();
};
recognition.onerror = function(event){
    console.log(event.error);
};
recognition.lang = "id-ID";
recognition.start();
}
function stopRekam(){
    if(recognition){
        recognition.stop();
        recognition = null;
    }
}
function rubahRekaman(){
    if(recognition){
        stopRekam();
    } else {
        rekam();
    }
}
function setTeks(text){
    $("#input").val(text);
    kirim_data();
}
function kirim_data() {
    $("#response").hide();
    $("#loader").css("display", "block");
    setTimeout(function(){
        $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "id", sessionId: "somerandomthing" }),
        success: function(data) {
            $("#loader").css("display", "none");
            $("#response").show();  
            setResponse(JSON.stringify(data, undefined, 2));
        },
        error: function() {
            setResponse("Internal Server Error");
        }
    });
    }, 1000);
    var text = $("#input").val();
}
function setResponse(val) {
    var obj = JSON.parse(val);
    $("#response").text(obj.result.fulfillment.speech);
}
