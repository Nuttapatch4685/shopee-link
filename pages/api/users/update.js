import axios from "axios";

export default async function handler(req, res) {
  let payload = JSON.parse(req.body);
  const token = localStorage.getItem("token");

  await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${payload.user_id}`, payload, {
      headers: {
        Authorization: token, // Forward the token
        "Content-Type": "application/json",
      },
    })
    .then((data) => {
      console.log("response update", data);
      if (data.status === 200) {
        res.status(200).json(data.data);
      }
    })
    .catch((e) => {
      console.log("Update user frontend : ", e.message);
      // let response = e.response;
      // console.log("response catch : ", response);
      res.status(400).json("Server error");
    });
}
