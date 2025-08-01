import axiosInstance from "@/utils/api.utils";

export default async function handler(req, res) {
  let getPayload = JSON.parse(req.body);

  await axiosInstance
    .post(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, getPayload.data, {
      headers: {
        Authorization: `Bearer ${getPayload.token}`,
        "Content-Type": "application/json",
      },
    })
    .then((data) => {
      if (data.status === 200) {
        res.status(200).json(data.data);
      }
    })
    .catch((e) => {
      res.status(500).json(e.message);
    });
}
