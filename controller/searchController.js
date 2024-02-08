const axios = require("axios");
const openai = require("openai");
async function searchController(req, res) {
  console.log("searchController");
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: "Query is required" });
  const openaiObject = new openai.OpenAI({
    apiKey: process.env.OPENAI_APIKEY,
  });

  try {
    //* This will give us the icon and 2 projects related to the query
    const openaiResponse = await openaiObject.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `can you return a single fontawesome icon name, and 2 projects ideas related to ${query}, give in json format. remember, return full icon like, example: "fas fa-house". try to return a free icon if possible.
          json format: {
            "iconName": <icon name>,
            "projects":[
              {
                "title": <project title>,
                "pointers"[
                  "point1",
                  "point2",
                  "point3"
                ]
              },
              {
                "title": <project title>,
                "pointers"[
                  "point1",
                  "point2",
                  "point3"
                ]
              }
            ]
          }`,
        },
      ],
    });

    let iconFromAI = JSON.parse(
      openaiResponse.choices[0].message.content
    ).iconName;
    // "fas fa-house"
    iconFromAI = iconFromAI.split(" ")[1];
    // "fa-house"
    iconFromAI = iconFromAI.split("-")[1];
    // "house"
    let projects = JSON.parse(
      openaiResponse.choices[0].message.content
    ).projects;
    const result = await axios({
      url: "https://api.fontawesome.com",
      method: "post",
      data: {
        query: `
      query Search {
        search(version: "6.0.0", query: "${iconFromAI}", first: 10) {
            id
            familyStylesByLicense {
                free {
                    prefix
                }
            }
        }
    }
    `,
      },
    });
    //* This calls the GraphQL API of fontawesome to:
    //* 1. Search for the icon, if it exists and if it is free
    //* 2. If it exists and is free, return the icon name in the format "fas fa-house"

    const search = result.data.data.search;
    if (search.length === 0) {
      return res.status(400).json({ error: "Not found" });
    }
    let icon;
    for (var i = 0; i < search.length; i++) {
      const free = search[i].familyStylesByLicense.free;
      if (free.length > 0) {
        const id = `fa-${search[i].id}`;
        const prefix = free[0].prefix;
        icon = `${prefix} ${id}`;
        break;
      }
    }
    if (!icon) return res.status(400).json({ error: "Not found" });
    return res.status(200).json({ icon, projects });
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = searchController;
