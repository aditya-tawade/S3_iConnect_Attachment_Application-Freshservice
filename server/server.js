// const fs = require("fs");
// const AWS = require("aws-sdk");

// const s3 = new AWS.S3({
//   accessKeyId: "AKIA353WZ76QOIGZSGFV",
//   secretAccessKey: "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",
// });

exports = {
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
          // console.log("DARTA---------------", data);
          return data;
          // const result = data.conversations
          //   .map((item) =>
          //     item.attachments.map((attachment) => attachment.attachment_url)
          //   )
          //   .flat();
          // var attach = result.join("\n\n");
        },
        function (error) {
          console.log(error);
        }
      )
      .then((conversation) => {
        // console.log("TETST", conversation);
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
