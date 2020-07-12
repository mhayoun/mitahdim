$(function() {
    var code_confirmation=0;

    function save_to_new_json_file(b){
        //cat, sub_cat, name_biz, address, area_code, phone, comments, email, name
    console.log('save_to_new_json_file...cat='+b.cat + " sub_cat_file="+b.sub_cat_file)
    json_filepath = 'data/'.concat(b.cat, '/', b.sub_cat_file)
    //file not existing....
    //create json_obj with new entry
    //var json_obj_0 = {name_biz:[0,address,area,phone,comments]}
    //console.log(json_obj_0)
    var json_obj={}
    var d = new Date();
    json_obj[b.name_biz]=[0, b.address, b.area_code, b.phone, b.comments, d.toJSON(), b.email, b.name]
    console.log('====')
    console.log(json_obj)
    saveToFile(json_obj, json_filepath)
  }

    function save_to_json_file(b){
    console.log('save_to_json_file...cat='+b.cat + " sub_cat_file="+b.sub_cat_file)
    json_filepath = 'data/'.concat(b.cat, '/', b.sub_cat_file)
    loadJSON(json_filepath, function (response) {
        console.log("Parse JSON string into object...");
        json_obj = JSON.parse(response);
        var d = new Date();
        json_obj[b.name_biz] = [0, b.address, b.area_code, b.phone, b.comments, d.toJSON(), b.email, b.name]
        saveToFile(json_obj, json_filepath)
    })
  }

    function save_to_dico_json_file(sub_cat_file, sub_cat){
    console.log('save_to_dico_json_file...sub_cat='+sub_cat)
    json_filepath = 'data/dico/dico.json'
    loadJSON(json_filepath, function (response) {
        console.log("Parse JSON string into object...");
        json_obj = JSON.parse(response);
        dico_value = 'temp_'+sub_cat
        console.log('dico_value='+dico_value)
        json_obj[sub_cat_file] = [dico_value, dico_value]
        saveToFile(json_obj, json_filepath)
    })
 }

    function alert_msg(s){
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success')
            .html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append("<strong>החלפנו את הכתובת...זה מה שהתכוונתה?</strong><br>"+s);
        add = "https://www.google.com/maps/search/?api=1&query="+s
        $('#success > .alert-success')
            .append($("<br><a href=\""+add+"\" target=\"_blank\">אם לא אפשר לחפש ב-GOOGLE MAP</a>"));
        $('#success > .alert-success')
            .append('</div>');
        //$("#sendMessageButton").toggleClass("example-p-7-1");
        //$("#sendMessageButton").toggleClass("btn-block");
    }

    function isValidEmail(email) {
      var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
      res =  pattern.test(email);
      if (!res)alert('format email incorrect.....');
      return res;
    };

    function isValidNameBiz(name_biz, json_obj){
        console.log('check json for name....')
        console.log(json_obj)
        for (let key in json_obj){
            console.log('key='+key)
            if (key==name_biz) {
                alert('Name already exists <' + key + '>')
                return false
            }
        }
        return true
    }

    //iterate array of json obj and find key by value
    //{tables.json:["שולחנות","tables"], chairs.json:[c1,c2],...}
    function findElement(data, propValue) {
        for (var key in data){
            //key is tables.json
            if(data[key][0]==propValue)
                return key
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function get_biz(){
        // get values from FORM
        var area_string = $("select.area_add_new").children("option:selected").val()
        var area_code = parseInt(area_string, 10)
        var area = $("select.area_add_new").children("option:selected").text()

        var cat = $("select.cat_add_new").children("option:selected").val()
        var sub_cat_title = $("input#sub_cat")[0].title;
        var sub_cat=$("input#sub_cat").val().trim();

        var name_biz = $("input#name_biz").val().trim();
        var address = $("input#address").val().trim();
        var name = ''; // $("input#name").val().trim();
        var email = $("input#email").val().trim();
        var phone = $("input#phone").val().trim();
        var comments = $("textarea#message").val();

        name_biz = name_biz.replace(/  +/g, ' ')

        console.log('get_biz cat='+cat)
        console.log('get_biz sub_cat_title='+sub_cat_title)
        console.log('get_biz sub_cat='+sub_cat)

        //by default it is the file name of the sub_cat if selected in the list
        var sub_cat_file = sub_cat_title;
        var new_data_file=false;

        //else if entered as input, title has the value 'temp'
        if (sub_cat_title=='temp'){
            console.log('check if file already exists for sub_cat=<'+sub_cat+'> in dico...')
            var findElt = findElement(json_obj_dico, sub_cat)
            if(findElt){
                console.log('find file <'+findElt+'>')
                sub_cat_file = findElt
            }
            else{
                console.log('not find file, will be create... ')
                var nb = getRandomInt(999999)
                sub_cat_file='temp'+nb.toString()+'.json'
                new_data_file = true;
            }
        }

        var fn = cat + '/'+  area + '/' + sub_cat + '/' + name_biz + '/';
        var ln = name;
        var ad = address;
        var em = email;
        var ph = phone;
        var or = comments;

        var bizId = '80523';
        var tmpUn = '11111';
        var SelLg = 'en';

        var mydata = '{' +
            '"bizId":"' + bizId + '"' + ',' +
            '"tmpUn":"' + tmpUn + '"' + ',' +
            '"SelLg":"' + SelLg + '"' + ',' +
            '"fn":"'    + fn + '"' + ',' +
            '"ln":"'    + ln + '"' + ',' +
            '"ad":"'    + ad + '"' + ',' +
            '"em":"'    + em + '"' + ',' +
            '"ph":"'    + ph + '"' + ',' +
            '"or":"'    + or + '"' +
            '}';


        var path = 'data/'+ cat + '/' + sub_cat_file;
        var add_area = address + ', ' + area

        //cat, sub_cat_file, name_biz, address, area_code, phone, comments, email, name
        //cat, sub_cat_file, name_biz, address, area_code, phone, comments, email, name
        const biz = {
            cat : cat,
            sub_cat_file: sub_cat_file,
            name_biz:name_biz,
            address:address,
            area_code:area_code,
            phone:phone,
            comments:comments,
            email : email,
            name:name,
            path : path,
            add_area : add_area,
            sub_cat : sub_cat,
            mydata : mydata,
            new_data_file:new_data_file
        }
        return biz;
    }

    function check_code(code){
        n=5
        while(n>0){
            console.log('try...'+n)
            if (check_code_try(code)==true){
                return true
            }
            else{
                n-=1
                console.log(n)
            }
        }
        return false
    }

    function display_success_message_check_code(code, n){
        if (n==0){
            display_fail_message_error_code()
            return;
        }
            
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append("<strong>Your message has been sent.  Please check you email for confirmation code </strong>");
        $('#success > .alert-success')
            .append('</div>');
        //clear all fields
        bootbox.prompt({ 
            size: "small",
            title: "What is your confirmation code ?",
            callback: function(result){ 
                /* result = String containing user input if OK clicked or null if Cancel clicked */ 
                if (result==null || result!=code) {
                    display_success_message_check_code(code, n-1)
                }
                else{
                    display_success_message()
                }
            }
        });
    }

    function display_success_message(){
        $('#success').html("<div class='alert alert-success'>");
        $('#success > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-success')
            .append("<strong>Your message has been sent. </strong>");
        $('#success > .alert-success')
            .append('</div>');
        //clear all fields
        $('#add_new_form').trigger("reset");
        $this.prop("disabled", false);
    }

    function display_fail_message_error_code(){
        // Fail message
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-danger').append($("<strong>").text("Incorrect code"));
        $('#success > .alert-danger').append('</div>');
        //clear all fields
        $('#add_new_form').trigger("reset");
    }

    function display_fail_message(name){
        // Fail message
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-danger').append($("<strong>").text("Sorry " + name + ", it seems that my mail server is not responding. Please try again later!"));
        $('#success > .alert-danger').append('</div>');
        //clear all fields
        $('#add_new_form').trigger("reset");
    }

    function display_incorrect_add(biz){
        //alert('format address incorrect...please check with google maps...https://maps.google.co.il');
        $('#success').html("<div class='alert alert-danger'>");
        $('#success > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
        $('#success > .alert-danger').append($("<strong>").text("Incorrect Address <"+biz.address+"> please check on "));
        $('#success > .alert-danger').append($("<a href=\"https://maps.google.co.il\" target=\"_blank\" >Google Map</a>"));
        $('#success > .alert-danger').append('</div>');
        $this.prop("disabled", false);

    }

    function process_next_step(biz){
        $this = $("#sendMessageButton");
        $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages
        var map = new google.maps.Map(document.getElementById('map'))
        geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': biz.add_area}, function(results, status) {
            if (status === 'OK') {
                add_found = results[0].formatted_address
                if (add_found != biz.address) {
                    alert_msg(add_found)
                    $this.prop("disabled", false);
                    $('#address').val(add_found)
                    return
                }
                if (biz.new_data_file) {
                    console.log('create new file...')
                    save_to_new_json_file(biz)
                    save_to_dico_json_file(biz.sub_cat_file, biz.sub_cat)
                } else save_to_json_file(biz)
                $.ajax({
                    url: "/admin/Service2.svc/SendEmail", type: "POST", data: biz.mydata,
                    contentType: "application/json; charset=utf-8", dataType: "json",
                    success: function (data) {
                        if (data && data.d && data.d > 0) {
                            code_confirmation = data.d
                            display_success_message_check_code(code_confirmation,3)
                        }
                    },
                    error: function () {
                        display_fail_message(biz.name)
                    },
                    complete: function () {
                        setTimeout(function () {
                            $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
                        }, 1000);
                    }
                })
            } else {
                display_incorrect_add(biz)
            }
        })
    }

    $("#add_new_form input,#add_new_form textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // additional error messages or events
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            const biz = get_biz()
            if (!isValidEmail(biz.email)) return;
            if (!biz.new_data_file){
                loadJSON(biz.path, function (response) {
                    let json_obj = JSON.parse(response) // Parse JSON string into object
                    if(!isValidNameBiz(biz.name_biz, json_obj)) return;
                    process_next_step(biz)
                })
            }
            else{
                process_next_step(biz)
            }
        },
        filter: function() {
            return $(this).is(":visible");
        },
  });

  $("a[data-toggle=\"tab\"]").click(function(e) {
    e.preventDefault();
    $(this).tab("show");
  });
});

/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
  $('#success').html('');
});


////    UrlExists(cat, sub_cat)==false
//function UrlExists(cat, subcat)
//{
//    var url=''
//    if (location.hostname === "localhost" || location.hostname === "127.0.0.1")
//        url = 'http://localhost:63342/'
//    else
//        url = 'http://www.mitahdim/mitahdom04/'
//
//    url += 'data/'+cat+'/'+sub_cat+'.json'
//    var http = new XMLHttpRequest();
//    http.open('HEAD', url, false);
//    http.send();
//    return http.status!=404;
//}
