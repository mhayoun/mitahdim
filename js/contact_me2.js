$(function() {

  $("#contactForm2 input,#contactForm2 textarea").jqBootstrapValidation({
    preventSubmit: true,
    submitError: function($form, event, errors) {
      // additional error messages or events
    },
    submitSuccess: function($form, event) {
      event.preventDefault(); // prevent default submit behaviour
      // get values from FORM
      //var name = $("input#name").val();
      var email = $("input#email2").val();
      //var phone = $("input#phone").val();
      var message = $("textarea#message2").val();
      var firstName = name; // For Success/Failure Message
      // Check for white space in name for Success/Fail message
      if (firstName.indexOf(' ') >= 0) {
        firstName = name.split(' ').slice(0, -1).join(' ');
      }
      $this = $("#sendMessageButton2");
      $this.prop("disabled", true); // Disable submit button until AJAX call is complete to prevent duplicate messages

      var $fn = '';
      var $ln = '';
      var $ad = '';
      var $em = email;
      var $ph = '';
      var $or = message;

      var $bizId = '80523';
      var $tmpUn = '11111';
      var $SelLg = 'en';

      var $mydata = '{' +
          '"bizId":"' + $bizId + '"' + ',' +
          '"tmpUn":"' + $tmpUn + '"' + ',' +
          '"SelLg":"' + $SelLg + '"' + ',' +
          '"fn":"' + $fn + '"' + ',' +
          '"ln":"' + $ln + '"' + ',' +
          '"ad":"' + $ad + '"' + ',' +
          '"em":"' + $em + '"' + ',' +
          '"ph":"' + $ph + '"' + ',' +
          '"or":"' + $or + '"' +
          '}';

       console.log("alert...");
        
//       alert('$tmpUn=' + $tmpUn + ' $bizId=' + $bizId +
//             '$fn='+ $fn + '$ln='+ $ln + '$ad='+ $ad +
//             '$em=' + $em + '$ph=' + $ph + '$or=' + $or +
//             '$$mydata='+$mydata);


      $.ajax({
        url: "/admin/Service2.svc/SendEmail",
        type: "POST",
        data: $mydata,
        contentType: "application/json; charset=utf-8",
        dataType:"json",
        success: function() {
          // Success message
          $('#success2').html("<div class='alert alert-success'>");
          $('#success2 > .alert-success').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success2 > .alert-success')
            .append("<strong>Your message has been sent. </strong>");
          $('#success2 > .alert-success')
            .append('</div>');
          //clear all fields
          $('#contactForm2').trigger("reset");
        },
        error: function() {
          // Fail message
          $('#success2').html("<div class='alert alert-danger'>");
          $('#success2 > .alert-danger').html("<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;")
            .append("</button>");
          $('#success2 > .alert-danger').append($("<strong>").text("Sorry " + firstName + ", it seems that my mail server is not responding. Please try again later!"));
          $('#success2 > .alert-danger').append('</div>');
          //clear all fields
          $('#contactForm2').trigger("reset");
        },
        complete: function() {
          setTimeout(function() {
            $this.prop("disabled", false); // Re-enable submit button when AJAX call is complete
          }, 1000);
        }
      });
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
$('#name2').focus(function() {
  $('#success2').html('');
});
