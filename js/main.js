/**
 * Created by fred on 12/3/19.
 */

//map for google map
var map;

// map_markers is a map collection of (key, value) for keeping markers display or not
// key: "gmahim_tables", "gmahim_chairs"
// key is sub-category of Gmahim,... like m_tables, m_chairs (id of list item in sidebar)
// value = {display:1/0, markers:[marker1, marker2,...]}
// value is list of display value 1/0 , markers array of markers
var map_markers = new Map();

// map_sections is a map collection of (key,value) containing the data of a gmah get when click on the menu/sub_menu
// key is for ex gmahim_chairs, value is arrays of gmahims like [gmah1, gmah2,...]
// each gmah is an object of the json file
var map_sections = new Map();
var prev_div_section='';
var prev_marker=null;
var prev_area_id = ''
var prev_id = ''
var current_area_id=0 //default value for area
var current_area_label=''
//current gmah id not area... like gmah_chairs
var current_id=''
var detectmob_variable = detectmob()
//get data
var json_obj;

//var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

function initMap() {
    console.log('init map...');
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 14
    });
}
function disp_len(res){
    log(res[0].classList.length)
}
function log(s){
    console.log(s);
    //s0 = $('#log').html()
    //$('#log').html(s0+'/'+s)
}
function detectmob() {
    $('#width').html(window.innerWidth);
    $('#height').html(window.innerHeight);
    if(window.innerWidth <= 800 && window.innerHeight <= 680) {
        log('m');
        return true;
    } else {
        log('pc');
        return false;
    }
}
function get_infowindow(name, address, data){
    var contentString = get_content_string_for_infowindow(name, address, data)
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 320
    });
    return infowindow
}

//function call_bootbox(n){
//    if (n==0)return;
//    bootbox.prompt({ 
//                size: "small",
//                title: "What is your name?",
//                callback: function(result){ 
//                    /* result = String containing user input if OK clicked or null if Cancel clicked */ 
//                    console.log(result)
//                    if (result=='fred') return;
//                    else call_bootbox(n-1)
//                }
//            });
//}



//0.0
console.log('start mitahdim :)...')

//call_bootbox(3)

refresh_json()
//0.1 start with hide map and sidebar
$("#map").hide();
$('#sidebar-wrapper').hide();

//0.2 if desktop close sidebar
if (detectmob_variable == false){
    //in desktop the sidebar is open (len==2)
    log('tg');
    res = $("#wrapper").toggleClass("toggled");
    disp_len(res) //move to len == 3 d-flex, rtl, toggled
}
else{ //on mobile hide the sidebar
    log('al_tg')
    res = $("#wrapper")
    disp_len(res)
    $('#sidebar-wrapper').hide();
}

//1. fill cat/sub_cat of add_new/map/menu - prepare pre-sections
//  start by loading the dico

var json_obj_dico;
call_loadJSON('data/dico/dico.json');
function call_loadJSON(path_json_dico_file){
    loadJSON(path_json_dico_file, function (json_string) {

        function remove_markers_of_prev_id(){
            if(prev_id && prev_id.substring(0,4)!='area'){
                console.log('remove_markers_of_prev_id........remove all markers of prev_id='+prev_id)
                key = prev_id + '_' + current_area_id.toString()
                console.log('remove_markers_of_prev_id...key='+key)
                value = map_markers.get(key);
                for (var i = 0; i < value.markers.length; i++) {
                    value.markers[i].setMap(null);
                }
                //prev_id=''
            }
        }
        
        //id is identity attribute html element like for example
        //<li class="list-group-item" id="gmahim_tables"
        //id = gmahim_tables, area_area0,....
        function set_id(id, elt){
            console.log('set_id...click on='+id + ' prev_area_id='+prev_area_id+ ' elt='+elt + ' prev_id='+prev_id)
            //first remove any previous marker from menu....
            if(prev_marker){
                prev_marker.setMap(null)
                prev_marker=null
            }
            //remove any section
            if (prev_div_section){
                $(document).find('#'+prev_div_section).html('')
                prev_div_section=''
            }

            if(id.substring(0,4)=='area'){
                if (id==prev_area_id){
                    console.log("set_id...prev_area_id=====id do nothing..."+id)
                    return
                }
                else{
                    remove_markers_of_prev_id()
                    current_area_id = parseInt(id.substring(9),10) //area_areaXX
                    console.log('set_id...current_area_id='+current_area_id + ' prev_id='+prev_id)
                }
            }
            else {
                current_id = id
                console.log('----------------------------------current_id='+current_id)
                if (id===prev_id) {
                    console.log("set_id...prev_id=====id do nothing...." + id)
                    return
                }

                if(prev_id){
                    console.log('WARNING !! show_hide_toogle...MOVE TO A NEW GMAH REMOVE PREVIOUS....toogle prev_id='+prev_id)
                    document.getElementById(prev_id).classList.toggle('list-group-item-warning')
                    remove_markers_of_prev_id()
                }
                prev_id = id
                console.log("WARNING !!! prev_id="+prev_id)
            }
            //return true if selected or false deselected
            //when selecting sub_category the class "list-group-item-warning" is added to the classlist
            
            selected_id = document.getElementById(id).classList.toggle('list-group-item-warning')
            console.log('WARNING ! set_id...id='+id+' selected_id='+selected_id + ' prev_id='+prev_id)
            // pass area0, area1, tables, chairs
            show_hide_toogle(id, selected_id);
            console.log('**************set_id...display_section_table...id='+id +' current_id='+current_id)
            if(current_id)
                display_section_table(current_id, from_menu=false)
        }
        function display_section_table_with_click(id, json_obj, from_menu=true){
            console.log('display_section_table_with_click id='+id)
            div_id = 'div_'+id  //div_gmahim_tables
            table_items = get_table_items(id, json_obj, current_area_id, detectmob_variable)
            console.log('display_section_table_with_click table_items='+table_items)
            if (prev_div_section)
                $(document).find('#'+prev_div_section).html('')
            prev_div_section = div_id

            if (from_menu) {
                //$("#carouselExampleInterval").hide();
                //$("#map").hide();
                $('#sidebar-wrapper').hide();
            }

            //title_area_html = get_title_area_html(current_area_label)
            //console.log('get_title_area_html...................................title_area_html='+title_area_html)
            //$(document).find('#'+div_id).html(title_area_html+table_items)
            $(document).find('#'+div_id).html(table_items)

            $("tr").click(function(){
                var elt = $(this)[0].cells[0].innerText;
                id = $(this)[0].id
                console.log('tr selected...elt='+elt+" id="+id)
                if(id) set_id_elt(id, elt)
            });
        }
        function display_section_table(id, from_menu=true){
            console.log('display_section_table...cat_subcat='+id)
            if (map_sections.has(id)){
                console.log('id='+id +' exists in map_sections...')
                json_obj = map_sections.get(id);
                display_section_table_with_click(id, json_obj, from_menu)
            }
            else{
                collections = id.split('_')
                path = 'data/'+ collections[0] + '/' + collections[1]+ '.json'
                loadJSON(path, function (response) {
                    json_obj = JSON.parse(response) // Parse JSON string into object
                    map_sections.set(id,json_obj); //set key/value in map_sections
                    display_section_table_with_click(id, json_obj, from_menu)
                });
            }
        }
        function fill_cat_list_menu_and_pre_sections(map_cats){
            //update select list cats/sub_cats...
            console.log('fill_cat_list_menu_and_pre_sections...')
            // iterate over keys
            var index=0
            //there are multiple sub_cats
            menu_dropdown=''
            //there is only one sub_cat like knesset/knesset
            menu_list=''
            // pre_section_list is a list of pre-sections ready to be filled with list of a specific cat/subcat
            pre_section_list=''
            section_all_start = section_all_get_start_html('all')
            section_all_thead = '<thead><tr>'
            map_section_tbody = new Map()
            title_area_html=''
            menu_area_list='<select class="custom-select area" style="width: 150px">'
            var col = 0
            for (let cat of map_cats.keys()) {
                console.log('cat==========================='+cat)
                if (cat=="area"){
                    v=0
                    for (let sub_area of map_cats.get(cat)){
                        subcat_label = (json_obj_dico.hasOwnProperty(sub_area))?json_obj_dico[sub_area][0]:sub_area
                        menu_area_list+='<option value="'+v+'">'+subcat_label+'</option>'
                        if (v==0){
                            current_area_label = subcat_label
                            //title_area_html = get_title_area_html(subcat_label)
                        }
                        v+=1
                    }
                    menu_area_list+='</select>'
                    continue;
                }
                cat_label = (json_obj_dico.hasOwnProperty(cat))?json_obj_dico[cat][0]:cat
                section_all_thead += '<th scope="col">'+cat_label+'</th>'
                var row=0
                if (map_cats.get(cat).length==1){
                    //id = cat+'_'+cat
                    for (let sub_cat of map_cats.get(cat)) {
                        id = cat+'_'+sub_cat.slice(0, -5);//remove extension .json
                        sub_cat_name = (json_obj_dico.hasOwnProperty(sub_cat))?json_obj_dico[sub_cat][0]:sub_cat
                        menu_list+=menu_get_sel_cat_html(id, sub_cat_name)
                        pre_section_list+=get_pre_section_list_html(id)
                        add_map_section_tbody(map_section_tbody, row, id, sub_cat_name, col)
                    }
                }
                else{
                    menu_dropdown += menu_get_dropdown_cat_start_html(cat_label)
                    for (let sub_cat of map_cats.get(cat)) {
                        id = cat+'_'+sub_cat.slice(0, -5);//remove extension .json
                        sub_cat_name = (json_obj_dico.hasOwnProperty(sub_cat))?json_obj_dico[sub_cat][0]:sub_cat
                        //if sub_cat_name from dico (hebrew) start with temp means that still not approved....
                        if (sub_cat_name.substring(0,4)=='temp'){
                            console.log(sub_cat_name+' not inserted in the list...not yet validate...')
                            continue
                        }
                        console.log('id========='+id +' sub_cat_name='+sub_cat_name)
                        menu_dropdown += '<a class="dropdown-item" href="#menu_'+id+'">' +sub_cat_name+'</a>'
                        pre_section_list+=get_pre_section_list_html(id)
                        add_map_section_tbody(map_section_tbody, row, id, sub_cat_name, col)
                        row+=1
                    }
                    menu_dropdown += '</div></li>'
                }
                col+=1
            }

            console.log('map_section_tbody...')
            console.log(map_section_tbody)

            console.log('pre_section_list='+pre_section_list)

            // set section_all
            // display table of all cat and sub_cat
            section_all_thead += '</tr></thead>'
            section_all_tbody = get_section_all_tbody(map_section_tbody, col)
            section_all_end = section_all_get_end_html()

            //set area list for table cat/sub_cats
            area_list_for_all = section_area_list_get_start_html()
            area_list_for_all += menu_area_list
            area_list_for_all += section_area_list_get_end_html()
            console.log('area_list_for_all....')
            console.log(area_list_for_all)

            section_all = ''.concat(section_all_start,section_all_thead,section_all_tbody,section_all_end)
            console.log('section_all_start='+section_all_start)
            console.log('section_all_thead='+section_all_thead)
            console.log('section_all_tbody='+section_all_tbody)
            console.log('section_all_end='+section_all_end)
            console.log('section_all===='+section_all)

            //console.log('title_area_html='+title_area_html)
            $(document).find('#section_area_list').html(area_list_for_all);
            $(document).find('#section_all').html(section_all);
            $(document).find('#sections').html(pre_section_list);

            //set menu_all
            menu_list += menu_add_sample_item('add_new', 'פרסום מודעה')
            menu_list += menu_add_sample_item('subscribe', 'התחבר לקבוצה')
            //menu_area_list removed for the moment
            menu_all = menu_area_list + menu_dropdown + menu_list
            console.log('menu_all='+menu_all)
            $(document).find('.navbar-nav').html(menu_all);

            $('.nav-item a').click(function(){
                console.log("WAOUH nav-item................")
                s = $(this).text()
                href = $(this)[0].hash
                console.log('nav-item='+href) //knesset_knesset...
                if (href)
                    display_section_table(href.substring(6))
            })
            $('.table a').click(function(){
                console.log("WAOUH table a................")
                s = $(this).text()
                href = $(this)[0].hash
                console.log('table href='+href) //knesset_knesset...
                if (href)
                    display_section_table(href.substring(6))
            })

            $("select.area").change(function(){
                var area = $(this).children("option:selected").val();
                current_area_label = $(this).children("option:selected").text()
                console.log("YOU have selected the area " + area +' current_area_label='+current_area_label);
                current_area_id = parseInt(area,10)
                //$("#map").hide();
                //$('#sidebar-wrapper').hide();
                if (prev_div_section){
                    //title_area_html = get_title_area_html(current_area_label          )
                    //$(document).find('#'+prev_div_section).html(title_area_html)
                    $(document).find('#'+prev_div_section).html('')
                }
            })

            $('#add_new').click(function(){ add_new_modal(); return false; })//hide_map=false
            $('#subscribe').click(function(){ subscribe_modal(); return false; })//hide_map=false
        }
        function fill_cat_list_map(map_cats){
            //update select list cats/sub_cats...
            console.log('fill_cat_list_map')
            // iterate over keys
            var index=0
            //there are multiple cards
            sel_acco=''
            //there is only one list
            sel_one_list='<ul class="list-group onlyone">'
            for (let cat of map_cats.keys()) {
                console.log(cat)
                cat_label = (json_obj_dico.hasOwnProperty(cat))?json_obj_dico[cat][0]:cat
                if (map_cats.get(cat).length==1){
                    id = cat+'_'+cat
                    sel_one_list+='<li class="list-group-item" id='+id+'>'+cat_label+'</li>'
                }
                else{
                    sel_acco += get_sel_acco_start_html(cat, cat_label, index)
                    index+=1;
                    for (let sub_cat of map_cats.get(cat)) {
                        id = cat+'_'+sub_cat.slice(0, -5);//remove extension .json
                        sub_cat_name = (json_obj_dico.hasOwnProperty(sub_cat))?json_obj_dico[sub_cat][0]:sub_cat
                        if (sub_cat_name.substring(0,4)=='temp'){
                            console.log(sub_cat_name+' not inserted in the list...')
                            continue
                        }
                        console.log('id========='+id)
                        sel_acco += '<li class="list-group-item" id="'+id+'">'+ sub_cat_name +'</li>'
                    }
                    sel_acco+=get_sel_acco_end_html()
                }
            }
            sel_one_list += '</ul>'
            menu_all = sel_acco + sel_one_list
            console.log(menu_all)
            $(document).find('.accordion').html(menu_all);

            $(".onlyone li").click(function(){
                var selId = $(this).attr('id');
                console.log('onlyone selId='+selId)
                set_id(selId)
            });

            //create trigger for each items
            for (let cat of map_cats.keys()) {
                console.log('----------------------------------------')
                console.log('cat for maps is='+cat)
                if (map_cats.get(cat).length==1){
                    continue;
                }
                elt = "."+cat+" li"
                console.log('elt is ============'+elt)
                //click event for sub_cat like Tables or Chairs...
                //id = gmahim_chairs
                $(elt).click(function(){
                    var id = $(this).attr('id');
                    console.log('CLICK EVENT on id='+id + ' prev_id='+prev_id)
                    set_id(id)
                });
            }
            //select first area by default
            document.getElementById("area_area0").classList.toggle('list-group-item-warning')
            prev_area_id = "area_area0"
        }
        function fill_cat_list_add_new(map_cats){
            //update select list cats/sub_cats...
            console.log('fill_cat_list_add_new')
            sel_area = get_select_html('שכונה','area_add_new')
            i=0
            console.log(map_cats)
            for (let sub_area of map_cats.get('area')){
                sub_area_label = (json_obj_dico.hasOwnProperty(sub_area))?json_obj_dico[sub_area][0]:sub_area
                sel_area+='<option value="'+i+'">'+sub_area_label+'</option>'
                i+=1
            }
            sel_area += ' </select>'
            // set the class categories with all the options
            $(document).find('.add_new_sub_area').html(sel_area);
            console.log('add_new_sub_area filled....')

            $("select.sub_area").change(function(){
                var sub_area = $(this).children("option:selected").val();
                console.log("You have selected the sub_area -- " + sub_area);
                if (sub_area=='NO_SELECTION') return;
            })

            sel_cat = get_select_html('קטגוריה','cat_add_new')
            // iterate over keys
            for (let cat_value of map_cats.keys()) {
                console.log(cat_value)
                if (cat_value=="area") continue;
                subcat_label = (json_obj_dico.hasOwnProperty(cat_value))?json_obj_dico[cat_value][0]:cat_value
                sel_cat += '<option value="'+cat_value+'">'+subcat_label+'</option>'
            }
            sel_cat += ' </select>'

            // set the class categories with all the options
            $(document).find('.categories').html(sel_cat);
            console.log('categories filled....')

            $("select.cat_add_new").change(function(){
                var cat = $(this).children("option:selected").val();
                console.log("You have selected the cat -- " + cat);
                if (cat=='NO_SELECTION') return;

                //if cat contains only sub_cat no need to display sub_cat
                //but hide sub_categories (id of the div...)
                if (map_cats.get(cat).length==1){
                    $('#sub_categories').hide();
                    return;
                }

                sel_sub_cat = '';
                for (let sub_cat_value of map_cats.get(cat)) {
                    console.log(sub_cat_value)
                    sub_cat_name = (json_obj_dico.hasOwnProperty(sub_cat_value))?json_obj_dico[sub_cat_value][0]:sub_cat_value
                    if (sub_cat_name.substring(0,4)=='temp'){
                        console.log(sub_cat_name + " not inserted in the list of add new...")
                        continue;
                    }
                    sel_sub_cat += ' <a class="dropdown-item" id="' + sub_cat_value +'" href="#">' + sub_cat_name + '</a>'
                }
                $('#sub_categories').show();
                $(document).find('.sub_cat').html(sel_sub_cat);

                //set input value with selected dropdown
                //when selecting a sub_cat like chairs, tables from dropdown we want to set this value in the input text(#sub_cat)
                // and also keep in title the keyword (for שולחן it is tables,...)
                $(".dropdown-menu a").click(function(){
                    s = $(this).text()
                    console.log('selected dropdown text='+s)
                    $('#sub_cat').val(s)
                    id = $(this)[0].id
                    console.log('selected dropdown id='+id)
                    $('#sub_cat').attr('title', id );
                    console.log('title='+$('#sub_cat').attr('title'));
                })
            });
        }
        function fill_cat_all_list_and_pre_sections(response_data_tree){
            console.log(response_data_tree);
            var map_cats = new Map();
            set_map_cats(response_data_tree, map_cats);
            console.log('map_cats....')
            console.log(map_cats)
            fill_cat_list_menu_and_pre_sections(map_cats)
            fill_cat_list_add_new(map_cats)
            fill_cat_list_map(map_cats)
        }

        json_obj_dico = JSON.parse(json_string);
        console.log('json_obj_dico...')
        console.log(json_obj_dico)
        //simulation
        if (location.hostname === "localhost" || location.hostname === "127.0.0.1"){
            console.log("It's a local server!");
            //simulate the list of folders/files of data folder
            // format is folder1,file1_2.json,file2_2.json;folder2
            //response_data_tree = 'area,area0.json,area1.json,area2.json;biz;dico,dico.json;gmahim,chairs.json,tables.json;hougim;knesset,knesset.json'
            //response_data_tree = 'area,area0.json,area1.json,area2.json;biz,electricity.json,installators.json;dico,dico.json;gmahim,chairs.json,tables.json;hougim,chirim.json,drawing.json;info,knesset.json'
            response_data_tree = 'area,area0.json,area1.json,area2.json;biz,electricity.json,installators.json;dico,dico.json;gmahim,chairs.json,tables.json,pens.json,money.json,cups.json,t1.json,t2.json,t3.json;hougim,chirim.json,drawing.json;info,knesset.json'
            //2. fill all the cat/subCat lists and pre_sections
            fill_cat_all_list_and_pre_sections(response_data_tree)
        }
        else {
            console.log("It's a real server!!!!");
            //real
            //get arborescence cat/sub_cat according to folder/files
            // under folder knesset     there is one file knesset.json
            // under folder biz         there is nothing
            // under folder gmahim      there are chairs.json, tables.json
            //response is like 'knesset,knesset.json;biz;gmahim,chairs.json,tables.json'
            var fd = new FormData();
            fd.append('dir', "E:\\web\\yelotagc\\mitahdim04\\data");
            $.ajax({
                url: 'php/listdir.php',
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function (response_data_tree) {
                    if (response_data_tree != 0) {
                        //2. fill all the cat/subCat lists and pre_sections
                        fill_cat_all_list_and_pre_sections(response_data_tree)
                    } else {
                        console.log('failed')
                    }
                },
                error: function () {
                    console.log('error listdir.php...')
                }
            });
        }
    });
}

function get_add_area(add, area){
    sub_area = 'area' + area.toString() + '.json'
    area_label = (json_obj_dico.hasOwnProperty(sub_area))?json_obj_dico[sub_area][0]:''
    add_area = (add!=area_label)? add + ', ' + area_label:add
    console.log('get_add_area...codeAddress...add_area=' + add_area)
    return add_area
}
function codeAddress(geocoder, selected_id, map, id, name, add, area, tel, comments, datetime, email, contact_name, elt) {
    console.log('codeAddress... id=' + id + ' add=' + add + ' name=' + name + ' selected_id=' + selected_id)
    add_area = get_add_area(add,area)
    geocoder.geocode({'address': add_area}, function(results, status) {
        //console.log('elt='+elt)
        if (status === 'OK') {
            //id can be area like area_area0 area_area1,....
            if (id.substring(0,4)=="area"){ //first 4 charachters
                if (selected_id){
                    if (prev_area_id){
                        //deselect previous
                        console.log("WARNING !!!!!!!!!!!!!!!!!!!! deselect prev_area_id="+prev_area_id)
                        document.getElementById(prev_area_id).classList.toggle('list-group-item-warning')
                    }
                    // keep current id in prev
                    prev_area_id=id
                    //focus on area
                    log('codeAddress...prev_area_id='+prev_area_id)
                    log('codeAddress...focus...')
                    map.setCenter(results[0].geometry.location);
                    map.setZoom(16);
                    if (current_id) {
                        console.log('codeAddress...CHECK MOVE TO NEW AREA....WITH SAME GMAH current_id='+current_id)
                        show_hide_toogle(current_id, true)
                    }
                }
                else{
                    //exit from focus
                    prev_area_id=''
                    log('codeAddress...exitfocus')
                    map.setZoom(14);
                }
                return;
            }

            if (typeof elt !== "undefined"){
                console.log('codeAddress...elt is defined=='+elt)
                console.log('codeAddress...setCenter for '+name)
                map.setCenter(results[0].geometry.location);
            }
            else{
                console.log('codeAddress...setCenter all for '+name + ' prev_id='+prev_id)
                map.setCenter(results[0].geometry.location);
            }

            //map.setZoom(16);

            for (key in json_obj){
                //
                add = json_obj[key][1]
                console.log('&&&&&&&&&&&&&&&& key='+key)
                console.log('&&&&&&&&&&&&&&&& json_obj[key][1]='+json_obj[key][1])
                console.log('&&&&&&&&&&&&&&&& results[0].formatted_address='+results[0].formatted_address)
                console.log('&&&&&&&&&&&&&&&& add_area='+add_area)

                //if (add==results[0].formatted_address){
                if (key==elt){
                    const [show, add, area, tel, comments, datetime]=get_json_obj(key)
                    console.log('FOUNDDDDDDDDDDDDDDDDDDDDDDDDDDDDD key='+key)
                    console.log('FOUNDDDDDDDDDDDDDDDDDDDDDDDDDDDDD comments='+comments)
                    add_area = get_add_area(add, area)
                    break
                }
            }
            data = get_data_for_marker(tel, comments, datetime, email, contact_name)
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>data')
            console.log(data)

            console.log('>>>>>>>>>>>>>>>>>>>>>>key='+key+' add_area='+add_area)
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                label: {
                    text: key,
                    color:"black",
                    fontSize: "16px",
                    fontWeight: "bold"
                },
                title:add_area,
                data:data
            });

            var infowindow = get_infowindow(key, add_area, data)

            console.log('codeAddress...marker.addListener')
            marker.addListener('click', function() {
                infowindow.open(map, marker);
            });

            if (typeof elt !== "undefined"){
                console.log('elt is defined=='+elt)
                if(prev_marker){
                    prev_marker.setMap(null)
                }
                infowindow.open(map, marker);
                prev_marker = marker;
                return
            }

            //infowindow.open(map, marker);

            // map_markers = id_XX, {display:0/1, markers{marker1, marker2,....} key=id_XX like gmah_tables_0 (area 0)
            // map_markers = id1:value1, id2:value2....
            key = id+'_'+current_area_id.toString()
            if (map_markers.has(key)){
                log('codeAddress...add marker for entry ' + key)
                value = map_markers.get(key);
                value.markers.push(marker)
            }
            else{
                log('codeAddress...add new entry in map_markers for '+key)
                markers=[]
                markers.push(marker)
                //from search map display is 1 else 0
                display = (typeof elt === "undefined")?1:0
                var value = {display:display, markers:markers};
                map_markers.set(key, value);
            }
        } else {
            alert('Address \n'+add_area+'\n was not successful for the following reason: ' + status);
        }
    });
}
function check_if_mob_then_close(){
    if (detectmob()){
        res = $("#wrapper")
        if (res[0].classList.length==3){
            $("#wrapper").toggleClass("toggled");
            $('#sidebar-wrapper').hide();
            log('tg_close')
        }
    }
}
function get_json_obj(name){
    //return //show,add,area,tel,comment,datetime,email,contact_name
    //       // 0  , 1 , 2  , 3 , 4     , 5      , 6   , 7

    if (json_obj[name].length===3) //area no tel...
        return [json_obj[name][0], json_obj[name][1],json_obj[name][2], undefined]
    else
        return [json_obj[name][0], json_obj[name][1],json_obj[name][2], json_obj[name][3],json_obj[name][4],json_obj[name][5],json_obj[name][6],json_obj[name][7]]
}

//id is the identity attribute html elt like area_area0, gmahim_tables,...
function add_json_obj_to_map_markers(geocoder, selected_id, map, id, json_obj){
    console.log('add_json_obj_to_map_markers...')
    var found=false
    for (biz_name in json_obj){
        const [show, add, area, tel, comments, datetime, email, contact_name]=get_json_obj(biz_name)
        if (area===current_area_id && show){
            found=true
            codeAddress(geocoder, selected_id, map, id, biz_name, add, area, tel, comments, datetime, email, contact_name)
        }
    }
    if(found)check_if_mob_then_close()
}
function show_hide_toogle(id, selected_id) {
    console.log('show_hide_toogle...prev_id='+prev_id)
    //check if map already displayed
    var x = document.getElementById("map");
    if (window.getComputedStyle(x).display === "none"){
        $("#carouselExampleInterval").hide();
        $("#map").show();
    }
    geocoder = new google.maps.Geocoder();
    // key of map_markers is id_XX like gmah_chairs_0 (of area 0)
    key = id+'_'+current_area_id.toString()
    if (map_markers.has(key)){
        console.log("show_hide_toogle...map_markers exists for key="+key)
        value = map_markers.get(key);
        //toggle display of the gmah of specific area on the page
        //value.display=(value.display==1)?0:1;
        //map_markers.set(key, value);
        for (var i = 0; i < value.markers.length; i++) {
            //console.log(value.markers[i])
            if (value.display==0){
                value.markers[i].setMap(null);
            }
            else {
                value.markers[i].setMap(map);
                if (i==0) {
                    check_if_mob_then_close();
                    console.log('show_hide_toogle...show_hide_toogle...show_hide_toogle setCenter...')
                    map.setCenter(value.markers[i].getPosition());
                }
            }
        }
    }
    else{
        if (map_sections.has(id)){
            console.log('show_hide_toogle... ' + id + ' exists in map_sections...')
            json_obj = map_sections.get(id);
            add_json_obj_to_map_markers(geocoder, selected_id, map, id, json_obj)
        }
        else{
            console.log('show_hide_toogle...id=<'+id+'> not exists in map_sections...get the data from data files....')
            //id = cat_subcat like gmahim_chairs or gmahim_tables...
            collections = id.split('_') // extract cat and subcat
            path = 'data/'+ collections[0] + '/' + collections[1] + '.json'
            loadJSON(path, function (response) {
                json_obj = JSON.parse(response)
                add_json_obj_to_map_markers(geocoder, selected_id, map, id, json_obj)
            });
        }
    }
}

//id is the identity attribute html elt like gmahim_tables_avi,...
// id = gmahim_tables
// elt = avi
function show_elt_in_map(id, elt) {
    //check if map already displayed
    console.log('show_elt_in_map...')
    var x = document.getElementById("map");
    if (window.getComputedStyle(x).display === "none"){
        $("#carouselExampleInterval").hide();
        $("#map").show();
    }
    $('body,html').animate({scrollTop: 0}, 400);
    //
    geocoder = new google.maps.Geocoder();
    // key of map_markers is id_XX like gmah_chairs_0 (of area 0)
    key = id+'_'+current_area_id.toString()
    if (map_markers.has(key)){
        console.log('show_elt_in_map key='+key+' already exists in map_markers...')
        value = map_markers.get(key);
        for (const marker of value.markers) {
            if (marker.label.text===elt){
                if(prev_marker){
                    console.log('show_elt_in_map...set NULL map for prev_marker ')
                    prev_marker.setMap(null)
                }
                console.log('found elt='+elt)
                var infowindow = get_infowindow(marker.label.text, marker.title, marker.data)
                marker.setMap(map)
                infowindow.open(map, marker)
                prev_marker = marker;
            }
            else{
                console.log('set Map null now for marker '+marker.label.text)
                marker.setMap(null)
            }
        }
    }
    else{
        collections = id.split('_')
        path = 'data/'+ collections[0] + '/' + collections[1] + '.json' // data/cat/subcat.json
        loadJSON(path, function (response) {
            // Parse JSON string into object
            json_obj = JSON.parse(response)
            for (name in json_obj){
                //show means that this elt can be show in the web site...
                //name:[show, add, area, tel, comments]
                const [show, add, area, tel, comments, datetime, email, contact_name]=get_json_obj(name)
                console.log('show_elt_in_map...name=<'+ name + '> elt=<'+ elt+ '> show='+show)
                if(show && name===elt){
                    console.log('show...<'+name+'>')
                    selected_id=undefined
                    codeAddress(geocoder, selected_id, map, id, name, add, area, tel, comments , datetime, email, contact_name, elt)
                    break;
                }
                else{
                    console.log("different name from elt....????")
                }
            }
        });
    }
}
function back_top(){
    len = $("#wrapper")[0].classList.length
    log(len)
    if((detectmob() && len==3) || (!detectmob() && len==2)){
        log('toggled')
        $("#wrapper").toggleClass("toggled");
        $('#sidebar-wrapper').hide();
    }
    $("#carouselExampleInterval").show();
    $("#map").hide();
}
function close_sidebar(){
    log('close_sidebar');
    res = $("#wrapper").toggleClass("toggled");
    disp_len(res)
    $('#sidebar-wrapper').hide();
}

function add_new_modal(){
    $("#add_new_modal").modal('show');
}

function subscribe_modal(){
    $('#subscribe_modal_label').html("היצטרף לקבוצה...");
    $("#subscribe_modal").modal('show');
}

$("#sticky_popup_email").click(function(e){
    $('#subscribe_modal_label').html("נא להשיר הודעה...");
})

function remove_markers_of_prev_id_external(){
    console.log('remove_markers_of_prev_id_external........remove all markers of prev_id='+prev_id)
    if(prev_id && prev_id.substring(0,4)!='area'){
        key = prev_id + '_' + current_area_id.toString()
        console.log('remove_markers_of_prev_id_external...key='+key)
        value = map_markers.get(key);
        for (var i = 0; i < value.markers.length; i++) {
            value.markers[i].setMap(null);
        }
        console.log("WARNING !!!! remove_markers_of_prev_id_external...toggle and set null prev_id="+prev_id)
        document.getElementById(prev_id).classList.toggle('list-group-item-warning')
        prev_id=''
    }
}

//cat_subcat_elt
function set_id_elt(id, elt){
    console.log('set_id_elt id ='+id +' elt='+elt)
    remove_markers_of_prev_id_external()
    show_elt_in_map(id, elt);
}

$("select.cat").change(function(){
    var cat = $(this).children("option:selected").val();
    alert("You have selected the cat: - " + cat);
});
$("select.area").change(function(){
    var area = $(this).children("option:selected").val();
    alert("You have selected the area " + area);
});
$("select.sub_cat").change(function(){
    var sub_cat = $(this).children("option:selected").val();
    alert("You have selected the sub_cat --- " + sub_cat);
});

$('#logo').click(function(){ back_top(true); return false; }) //hide_map=true
$('#main').click(function(){ close_sidebar(); return false; })//hide_map=false

// Menu Toggle Script of the 'Search Map' Button 
$("#menu-toggle").click(function(e) {
    log('click on menu-toogle')
    //console.log('clear sections....')
    //$(document).find('#sections').html('')

    e.preventDefault()
    var res = $("#wrapper").toggleClass("toggled")
    disp_len(res)
    if (detectmob()==false) {
        if (res[0].classList.length == 3)
            $('#sidebar-wrapper').hide();
        else $('#sidebar-wrapper').show();
    }
    else{
        if (res[0].classList.length == 3){
            log('m_SHOW');
            $('#sidebar-wrapper').show();
        }
        else{
            log('m_HIDE');
            $('#sidebar-wrapper').hide();
        }
    }
});

