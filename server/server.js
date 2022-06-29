exports = {
  onTicketCreateCallback: function (payload) {
    var headers = {
      Authorization: "Basic <%= encode('UfFTA68X62IYm3LCUWT') %>",
    };
    var ticketID = payload.data.ticket.id;
    console.log("Ticket ID", ticketID);
    var options = { headers: headers };
    var url = `https://iconnectsolutionspvtltd.freshservice.com/api/v2/tickets/${ticketID}`;
    $request.get(url, options).then(
      function (data) {
        data = JSON.parse(data.response);
        // console.log(data);
        // var AID = data.ticket.attachments;
        // console.log("Line 14", AID);
        var attachmentsID = data.ticket.attachments.map(
          (x) => x.attachment_url
        );
        var slice_attachmentsID = attachmentsID.join("\n\n");
        console.log("Attachment on Create URL:", slice_attachmentsID);
      },
      function (error) {
        console.log(error);
      }
    );
  },
  onConversationCreateCallback: function (payload) {
    // console.log(payload);
    var headers = {
      Authorization: "Basic <%= encode('UfFTA68X62IYm3LCUWT') %>",
    };
    //console.log(JSON.stringify(payload))
    var options = { headers: headers };

    var ticketID = payload.data.conversation.ticket_id;
    var attachmentsID = payload.data.conversation.attachments.map((x) => x.id);
    var slice_TP = attachmentsID.join("\n\n");
    var fileName = payload.data.conversation.attachments.map((x) => x.name);
    console.log("Ticket ID:", ticketID);
    var slice_fileName = fileName.join("\n\n");
    console.log("TP ID:", slice_TP);
    console.log("File Name:", slice_fileName);

    var url = `https://iconnectsolutionspvtltd.freshservice.com/api/v2/tickets/${ticketID}/conversations`;
    $request
      .get(url, options)
      .then(
        function (data) {
          data = JSON.parse(data.response);
          return data;
        },
        function (error) {
          console.log(error);
        }
      )
      .then((conversation) => {
        var s3_url = `https://nodejs.adityatawade.com/s3_upload`;
        var s3_options = {
          json: {
            ticketID: ticketID,
            slice_TP: slice_TP,
            slice_fileName: slice_fileName,
            conversation: conversation,
          },
        };

        $request.post(s3_url, s3_options).then(
          function (data) {
            console.log("S3 Response:", data.response);
          },
          function (error) {
            console.log(error);
          }
        );
      });
  },
};
