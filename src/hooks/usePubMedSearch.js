// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// export function usePubMedSearch(query) {
//   return useQuery({
//     queryKey: ["pubmed", query],
//     queryFn: async () => {
//       if (!query || query.trim() === "") return [];

//       // STEP 1 — Search for PMIDs
//       const searchURL = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
//       const searchParams = {
//         db: "pubmed",
//         term: query,
//         retmax: 10,
//         retmode: "json",
//       };

//       const searchRes = await axios.get(searchURL, { params: searchParams });
//       const pmids = searchRes.data.esearchresult.idlist;

//       if (!pmids.length) return [];

//       // STEP 2 — Fetch article metadata
//       const summaryURL = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;
//       const summaryRes = await axios.get(summaryURL, {
//         params: {
//           db: "pubmed",
//           id: pmids.join(","),
//           retmode: "json",
//         },
//       });

//       const resultObj = summaryRes.data.result;

//       // PubMed returns an "uids" array and a mapped object
//       const articles = resultObj.uids.map((uid) => resultObj[uid]);

//       return articles;
//     },
//     enabled: !!query, // only run when query is non-empty
//     staleTime: 1000 * 60 * 5, // 5 mins cache
//   });
// }



import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function usePubMedSearch(query) {
  return useQuery({
    queryKey: ["pubmed", query],
    queryFn: async () => {
      if (!query?.trim()) return [];

      // STEP 1 — SEARCH
      const searchRes = await axios.get(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
        {
          params: {
            db: "pubmed",
            term: query,
            retmax: 10,
            retmode: "json",
          },
        }
      );

      const pmids = searchRes.data.esearchresult.idlist;
      if (!pmids.length) return [];

      // STEP 2 — FETCH ABSTRACTS
      const fetchRes = await axios.get(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
        {
          params: {
            db: "pubmed",
            id: pmids.join(","),
            rettype: "abstract",
            retmode: "xml",
          },
        }
      );

      const parser = new DOMParser();
      const xml = parser.parseFromString(fetchRes.data, "text/xml");

      const articles = Array.from(xml.querySelectorAll("PubmedArticle")).map(
        (article) => {
          const getText = (selector) =>
            article.querySelector(selector)?.textContent || "";

          return {
            id: getText("PMID"),
            title: getText("ArticleTitle"),
            abstract:
              article
                .querySelector("AbstractText")
                ?.textContent || "No abstract available.",
            journal: getText("Journal Title"),
            year: getText("PubDate Year"),
            authors: Array.from(
              article.querySelectorAll("Author")
            )
              .map(
                (a) =>
                  `${a.querySelector("ForeName")?.textContent || ""} ${
                    a.querySelector("LastName")?.textContent || ""
                  }`
              )
              .join(", "),
          };
        }
      );

      return articles;
    },
    enabled: !!query,
    staleTime: 1000 * 60 * 5,
  });
}
