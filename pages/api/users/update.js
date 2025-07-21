import axios from "@/utils/api.utils";

export default async function handler(req, res) {
  let payload = JSON.parse(req.body);

  await axios
    .put(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${payload.user_id}`, payload)
    .then((data) => {
      if (data.status === 200) {
        res.status(200).json(data.data);
      }
    })
    .catch((e) => {
      let response = e.response;
      res.status(400).json(response.data);
    });
}
