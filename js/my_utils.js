//cat1,sub_cat11.json,sub_cat12.json;cat2,cat21.json
//first one is cat
//second,third,... are sub cat
//convert string of cat1,sub_cat11.json,sub_cat12.json;cat2,cat21.json
//knesset,knesset.json;biz;gmahim,chairs.json,tables.json
//to
//map{cat1=>[sub_cat11.json,sub_cat12.json]}, cat2=>[sub_cat21.json]})
//map{knesset=>[knesset.json], gmahim=>[chairs.json, tables.json]}
function set_map_cats(s, map_cats){
    var arr = s.split(";");
    for (i = 0; i < arr.length; ++i){
        var sub_arr = arr[i].split(",");
        //not inserting dico and area in map_cats
        if (sub_arr[0]=='dico') continue;
        //at least 2 elts like ['cat', 'sub_cat.json']
        if (sub_arr.length>1){
            var domains=[]
            for(j=1; j<sub_arr.length; j++){
                domains.push(sub_arr[j])
            }
            map_cats.set(sub_arr[0], domains)
        }
    }
}
//check if content of json file changed
//if yes reload the page
function refresh_json(pathfile){    
    var previous = null;
    var current = null;
    //console.log('refresh_json....')
    setInterval(function(pathfile) {
        //console.log('refresh_json....getJSON...')
        $.getJSON(pathfile, function(json) {
            //console.log('refresh_json...step1...')
            current = JSON.stringify(json);    
            //console.log(current)
            //console.log('refresh_json...step2...')
            if (previous && current && previous !== current) {
                console.log('refresh..............'+pathfile);
                location.reload();
            }
            console.log('refresh_json...step3...')
            previous = current;
        });                       
    }, 2000);   
}

function loadJSON(file, callback) {
    console.log('loadJSON...file='+file+' pwd='+window.location.pathname)
    console.log('reload...')
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}

//save data to the sub_cat file
// file is path of the sub_cat file
// data/cat/sub_cat.json
// ex:data/gmahim/tables.json
//
function saveToFile(json_obj, file){
    
    console.log('saveToFile...........')
    console.log(json_obj)

    file = '../'.concat(file)
    console.log(file)

    data = JSON.stringify(json_obj);
    console.log(data)

    console.log('saveToFile....2')

    var fd = new FormData();
    fd.append('file', file);
    fd.append('data', data);
    $.ajax({
        url: 'php/save_data.php',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response){
            if(response != 0){
                console.log(response);
            }
            else{
                console.log('failed')
            }
        },
        error: function () {
            console.log('error save_data_json.php...')
        }
    });
}

function stripHtml(html){
    // Create a new div element
    var temporalDivElement = document.createElement("div");
    // Set the HTML content with the providen
    temporalDivElement.innerHTML = html;
    // Retrieve the text property of the element (cross-browser support)
    return temporalDivElement.textContent || temporalDivElement.innerText || "";
}

//google signin/signout
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    var x = profile.getEmail();
    console.log('x:'+x);
    if (x=='yelotag@gmail.com' || x=='avishaihayoun@gmail.com'){
        console.log('display div_data...')
        $("#div_data").show();
    }
}
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out...hide div_data...');
        $("#div_data").hide();
    });
}

//region table all summary -
function get_title_area_html(area){
    s='<div class="container"><div class="row justify-content-md-center"><div class="col col-lg-2"></div>'
    s+='<div class="col-md-auto"><strong>'+area+'</strong></div><div class="col col-lg-2"></div></div></div>'
    return s
}
// create map_section_tbody
// Map is like
// biz [b1,b2]
// gmah[g1,g2,g3,g4]
// map_section_tbody is like
// 0 - b1, g1
// 1 - b2, g2
// 2 - _ , g3
// 3 - _ , g4
// table is
// <tr><td>b1</td><td>g1</td></tr>
// <tr><td>b2</td><td>g2</td></tr>
// <tr><td></td>  <td>g3</td></tr>
// <tr><td></td>  <td>g4</td></tr>
function add_map_section_tbody(map_section_tbody, row, id, cat_label, col){
    console.log('add_map_section_tbody...row='+row+' cat_label='+cat_label + ' id='+id + ' col='+col)
    obj = {id:id, cat_label:cat_label}
    if (map_section_tbody.has(row)){
        value = map_section_tbody.get(row);
    }
    else{
        value = []
    }
    len_val = value.length
    while (len_val<col){
        value.push({})
        len_val = value.length
    }
    value.push(obj)
    map_section_tbody.set(row, value)
    console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^')
    console.log(map_section_tbody)
}
function  get_section_all_tbody(map_section_tbody, cnt_col){
    console.log('get_section_all_tbody cnt_col='+cnt_col)
    s = '<tbody>'
    for (value of map_section_tbody.values()){
        console.log('get_section_all_tbody value='+value)
        s+='<tr>'
        for (i=0;i<cnt_col;i++){
            if (i<value.length && value[i].id){
                id = value[i].id
                cat_label = value[i].cat_label
                s += '<td><a href="#menu_'+id+'">'+cat_label+'</a></td>'
            }
            else{
                s+='<td></td>'
            }
        }
        s+='</tr>'
    }
    s+='</tbody>'
    console.log('s===================='+s)
    return s
}
//<div class="container">
//    <div class="row">
//        <div class="col-sm">
//        One of three columns
//        </div>
//        <div class="col-sm">
//        One of three columns
//        </div>
//        <div class="col-sm">
//        One of three columns
//        </div>
//    </div>
//</div>
//see sections.html
function section_all_get_start_html(id){
//    s='<section class="page-section section_'+id+'" id="menu_'+id+'" style="margin: 100; padding: 100">'
    s ='</br><section class="page-section">'
    s+='<div  class="bs-docs-section">'
    s+='<div class="row">'
    s+='<div class="col-lg-12">'
//    s+='<div class="bs-component" id="div_'+id+'">'
    s+='<div class="bs-component">'
    //1/3 1/3 1/3
    s+='<div class="container"><div class="row"><div class="col-sm"></div><div class="col-sm">'
    //end 1/3 1/3 1/3
    s+='<table class="table table-bordered table-sm">'
    return s
}
function section_all_get_end_html(){
    s ='</table>'
    //1/3 1/3 1/3
    s+='</div><div class="col-sm"></div></div></div>'
    //
    s+='</div>'
    s+='</div>'
    s+='</div>'
    s+='</div>'
    s+='</section>'
    return s
}
//endregion

//section for list of area for table containing all cat / sub_cats
function section_area_list_get_start_html() {
     s = '</br><section class="page-section">'
     s += '<div  class="bs-docs-section">'
     s += '<div class="row justify-content-md-center">'
     s += '<div class="col-lg-12">'
     s += '<div class="bs-component">'
     //1/3 1/3 1/3
     s += '<div class="container"><div class="row"><div class="col-sm"></div><div class="col-sm col-md-auto">'
     return s
}
function section_area_list_get_end_html(){
     //1/3 1/3 1/3
     s ='</div><div class="col-sm"></div></div></div>'
     s+='</div>'
     s+='</div>'
     s+='</div>'
     s+='</div>'
     s+='</section>'
     return s
}

////section for list of area for table containing all cat / sub_cats
//function section_area_list_get_start_html() {
//    s  = '</br><section class="page-section">'
//    s += '<div  class="container">'
//    s += '<div class="row justify-content-md-center">'
//    s += '<div class="col col-lg-2"></div><div class="col-md-auto">'
//    return s
//}
//function section_area_list_get_end_html(){
//    s  = '</div><div class="col col-lg-2"></div>'
//    s += '</div>'
//    s += '</div>'
//    s += '</section>'
//    return s
//}


function get_data_for_marker(tel, comments, datetime, email, contact_name){
    dateString = get_dateString(datetime)
    array_data = []
    array_data.push(tel, comments, dateString, email, contact_name)
    console.log('get_data_for_marker='+array_data)
    return array_data
}
function get_dateString(datetime){
    d = new Date(datetime)
    month = months[d.getMonth()];
    day = d.getDate()
    year = d.getFullYear()
    return day + month + year
}
function get_datetimeString(datetime){
    d = new Date(datetime)
    month = months[d.getMonth()];
    day = d.getDate()
    year = d.getFullYear()
    hour = d.getUTCHours().toString()
    min = d.getMinutes().toString()
    return day + month + year +  ' ' + ('0' + hour).slice(-2) + ':' + ('0' + min).slice(-2)
}
function get_content_string_for_infowindow(name, address, data){
    tel = data[0]
    comments = data[1]
    dateSring = data[2]
    email = data[3]
    contact_name = data[4]
    s = '<div id="content" style="text-align: center; vertical-align: middle">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<h5 id="firstHeading" class="firstHeading">'+name+'</h5>'+
        '<div id="bodyContent">'+
        '<p>' + address + '</p>'+
        '<p>' + comments + '</p>'+
        '<p>' + tel +' ' + contact_name+ '</p>'+
        '<p>' + dateSring + '</p>'+
        //'<p>' + email + '</p>'+
        '</div>'+
        '</div>';
    return s;
}

//region table_items which contains table of items for a specific cat/subcat
// section - list of items for a specific cat/subcat
// table which is filled with items of a specific cat/subcat to be insert in the pre-section (pre_section_list)

//<table class="table table-hover">
//    <tbody>
//        <tr id="gmahim_chairs" class="table-danger">
//            <th  scope="row">כסאות חיים</th>
//            <td>ברזיל 1, ירושלים, ישראל</td>
//            <td>0583212851</td>
//            <td>שולחנות קייטרינג עגולות, כסאות כתר, מפות שמנת</td>
//        </tr>
//        <tr id="gmahim_chairs" class="table-danger">
//            <th  scope="row">כסאות דן</th>
//            <td>ברזיל 2, ירושלים, ישראל</td>
//            <td>0583212851</td>
//            <td>comments...</td>
//        </tr>
//    </tbody>
//</table>

function get_table_items(id, json_obj, current_area_id, detectmob_variable){
    console.log(json_obj)
    len = Object.keys(json_obj).length
    console.log('get_table_items len='+len)
    i = len%3
    console.log('i='+i)
    var colors=["table-primary", "table-danger", "table-success"]

    //1/3 1/3 1/3
    //s='<div class="container"><div class="row justify-content-md-center"><div class="col col-lg-2"></div><div class="col-md-auto">'
    //end 1/3 1/3 1/3
    s = '</br><table class="table table-hover"><tbody>'
    console.log('get_table_items...current_area_id=<'+current_area_id+'>')
    array=[]
    for (biz_name in json_obj){
        const [show, add, area, tel, comments, datetime, email, contact_name]=get_json_obj(biz_name)
        console.log('get_table_items... biz_name ='+ biz_name + ' add=' + add + ' area=<' + area + '> tel=' + tel + ' show='+show)
        if(show && area==current_area_id){
            array.push({biz_name:biz_name , date:datetime, add:add, tel:tel, comments:comments, email:email, contact_name:contact_name})
        }
    }
    //sort array by date
    array.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.date) - new Date(a.date);
    });

    array.forEach(e => {
        console.log(e);
        console.log('add tr of a new elt...')
        s+='<tr id="'+id+'" class="'+colors[i]+'">'
        //s+='<td>'+ e.name+' '+e.tel+'</br>'+e.add+'</br>'+ e.comments+'</br>'+ get_datetimeString(e.date)+'</td>'
        s+='<th  scope="row">' + e.biz_name +'</th>'
        s+='<td>' + e.add + '</td>'
        s+='<td>' + e.tel + '</td>'
        //s+='<td>' + e.tel + ' ' + e.contact_name + '</td>'
//        s+='<td>'+element.date+'</td>'
        s+='<td>'+get_datetimeString(e.date)+'</td>'
        if (detectmob_variable==false){
            s+='<td>'+e.comments+'</td>'
            //s+='<td>'+e.email+'</td>'
        }
        s+='</tr>'
});


    s+='</tbody></table>'
    // 1/3 1/3 1/3
    //s+='</div><div class="col col-lg-2"></div></div></div>'
    return s
}
//endregion

//region pre_section_list - is a list of pre-sections ready to be filled with a table of items for a specific cat/subcat

//<section class="page-section section_gmahim_chairs" id="menu_gmahim_chairs" style="margin: 3; padding: 0">
//    <div  class="bs-docs-section">
//        <div class="row">
//            <div class="col-lg-12">
//                <div class="bs-component" id="div_gmahim_chairs"></div>
//            </div>
//        </div>
//    </div>
//</section>
//<section class="page-section section_gmahim_tables" id="menu_gmahim_tables" style="margin: 3; padding: 0">
//    <div  class="bs-docs-section">
//        <div class="row">
//            <div class="col-lg-12">
//                <div class="bs-component" id="div_gmahim_tables"></div>
//            </div>
//        </div>
//    </div>
//    </section>
//<section class="page-section section_knesset_knesset" id="menu_knesset_knesset" style="margin: 3; padding: 0">
//    <div  class="bs-docs-section">
//        <div class="row">
//            <div class="col-lg-12">
//                <div class="bs-component" id="div_knesset_knesset"></div>
//            </div>
//        </div>
//    </div>
//</section>

function get_pre_section_list_html(id){
s='<section class="page-section section_'+id+'" id="menu_'+id+'" style="margin: 3; padding: 0">'
s+='<div  class="bs-docs-section">'
s+='<div class="row">'
s+='<div class="col-lg-12">'
s+='<div class="bs-component" id="div_'+id+'">'
s+='</div>'
s+='</div>'
s+='</div>'
s+='</div>'
s+='</section>'
return s
}
//endregion


// add_new modal
// cat list
// <div style="width: 100px">
//     <label class="input-group-text">קטגוריה</label>
// </div>
// <select class="custom-select cat">
//     <option value="NO_SELECTION" selected>נא לבחור אחד מהרשימה</option>
//     <option value="gmahim">גמחים</option>
//     <option value="biz">בית עסק</option>
// </select>
// <a class="dropdown-item" id="tables" href="#">שולחן</a>
// <a class="dropdown-item" id="chairs" href="#">כסאות</a>

//use for cat and sub_cat select/options
function get_select_html(cat_label, class_value){
    var sel = '';
    sel += '<div style="width: 100px">'
    sel += '<label class="input-group-text">'+cat_label+'</label>';
    sel += '</div>'
    sel += '<select class="custom-select '+ class_value + '" >'
    sel += '<option value="NO_SELECTION" selected>נא לבחור אחד מהרשימה</option>'
    return sel;
}
//
// map
//
//<div class="card">
//    <div class="card-header">
//        <h5 class="mb-0">
//            <a data-toggle="collapse" data-target="#collapse_0">שכונות &#x25BE</a>
//        </h5>
//    </div>
//    <div id="collapse_0" class="collapse">
//        <ul class="list-group">
//            <li class="list-group-item" id="area_area0" >קריית מנחם</li>
//            <li class="list-group-item" id="area_area1" >קריית יובל</li>
//            <li class="list-group-item" id="area_area2" >עיר גנים</li>
//        </ul>
//    </div>
//</div>

//<div class="card">
//    <div class="card-header">
//        <h5 class="mb-0">
//            <a data-toggle="collapse" data-target="#collapse_1">גמחים &#x25BE</a>
//        </h5>
//    </div>
//    <div id="collapse_1" class="collapse">
//        <ul class="list-group gmahim">
//            <li class="list-group-item" id="gmahim_tables" >שולחנות</li>
//            <li class="list-group-item" id="gmahim_chairs" >כסאות</li>
//        </ul>
//    </div>
//</div>

function get_sel_acco_start_html(cat, cat_label, index){
    //this is an accordeon component 
    //https://getbootstrap.com/docs/4.1/components/collapse/#accordion-example
    console.log('map accordeon cat='+cat+' index='+index.toString())
    show_value = (cat==='area')?' show':''
    id = 'collapse_'+index.toString()
    var sel = '';
    sel += '<div class="card">'
    sel += '<div class="card-header">';
    sel += '<h5 class="mb-0">'
    sel += '<a data-toggle="collapse" data-target="#' + id + '">' + cat_label + ' &#x25BE</a>' //
    sel += '</h5>'
    sel += '</div>'
    sel += '<div id="' + id + '" class="collapse'+show_value+'">'
    sel += '<ul class="list-group ' + cat + '">'
    return sel;
}
function get_sel_acco_end_html(){
    sel = '</ul></div></div>'
    return sel;
}
//
// menu
//

//<select class="custom-select area" style="width: 200px">
//<option value="0" selected> kiriat Menahem</option>
//    <option value="1">Kiriat Yovel</option>
//    <option value="2">Ir Ganim</option>
//</select>



//<li class="nav-item dropdown">
//    <a class="nav-link dropdown-toggle" href="#" role="button"
//    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//    גמחים
//    </a>
//    <div class="dropdown-menu dropdown-menu-right">
//        <a class="dropdown-item" href="#menu_gmahim_tables">שולחן</a>
//        <a class="dropdown-item" href="#menu_gmahim_chairs">כסאות</a>
//    </div>
//</li>
//menu/sub_menus
function menu_get_dropdown_cat_start_html(cat_label){
    var sel = '';
    sel += '<li class="nav-item dropdown">'
    sel += '<a class="nav-link dropdown-toggle" href="#" role="button" '
    sel += 'data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
    sel += cat_label+'</a>' //&#x25BE
    sel += '<div class="dropdown-menu dropdown-menu-right">'
    console.log('menu_get_dropdown_cat_start_html='+sel)
    return sel;
}
//sample menu
//<li class="nav-item">
//    <a class="nav-link" href="#menu_knesset_knesset">בתי כנסת</a>
//</li>
function menu_get_sel_cat_html(id, cat_label){
    var sel = '';
    sel += '<li class="nav-item">'
    //href = #menu_knesset_knesset
    sel += '<a class="nav-link" href="#menu_'+id+'">'+cat_label+'</a>'
    sel += '</li>'
    return sel;
}

//menu_add_sample_item
function menu_add_sample_item(id, cat){
    var sel = '';
    sel += '<li class="nav-item">'
    sel += '<a class="nav-link" id="'+id+'">'+cat+'</a>'
    sel += '</li>'
    return sel;
}


