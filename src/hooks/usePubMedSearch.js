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



// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// export function usePubMedSearch(query) {
//   return useQuery({
//     queryKey: ["pubmed", query],
//     queryFn: async () => {
//       if (!query?.trim()) return [];

//       // STEP 1 — SEARCH
//       const searchRes = await axios.get(
//         "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
//         {
//           params: {
//             db: "pubmed",
//             term: query,
//             retmax: 10,
//             retmode: "json",
//           },
//         }
//       );

//       const pmids = searchRes.data.esearchresult.idlist;
//       if (!pmids.length) return [];

//       // STEP 2 — FETCH ABSTRACTS
//       const fetchRes = await axios.get(
//         "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
//         {
//           params: {
//             db: "pubmed",
//             id: pmids.join(","),
//             rettype: "abstract",
//             retmode: "xml",
//           },
//         }
//       );

//       const parser = new DOMParser();
//       const xml = parser.parseFromString(fetchRes.data, "text/xml");

//       const articles = Array.from(xml.querySelectorAll("PubmedArticle")).map(
//         (article) => {
//           const getText = (selector) =>
//             article.querySelector(selector)?.textContent || "";

//           return {
//             id: getText("PMID"),
//             title: getText("ArticleTitle"),
//             abstract:
//               article
//                 .querySelector("AbstractText")
//                 ?.textContent || "No abstract available.",
//             journal: getText("Journal Title"),
//             year: getText("PubDate Year"),
//             authors: Array.from(
//               article.querySelectorAll("Author")
//             )
//               .map(
//                 (a) =>
//                   `${a.querySelector("ForeName")?.textContent || ""} ${
//                     a.querySelector("LastName")?.textContent || ""
//                   }`
//               )
//               .join(", "),
//           };
//         }
//       );

//       return articles;
//     },
//     enabled: !!query,
//     staleTime: 1000 * 60 * 5,
//   });
// }



// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// export function usePubMedSearch(query, page = 1, pageSize = 10) {
//   return useQuery({
//     queryKey: ["pubmed", query, page],
//     queryFn: async () => {
//       if (!query?.trim()) {
//         return { articles: [], total: 0 };
//       }

//       const retstart = (page - 1) * pageSize;

//       // STEP 1 — SEARCH
//       const searchRes = await axios.get(
//         "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
//         {
//           params: {
//             db: "pubmed",
//             term: query,
//             retmax: pageSize,
//             retstart,
//             retmode: "json",
//           },
//         }
//       );

//       const result = searchRes.data.esearchresult;
//       const pmids = result.idlist;
//       const total = parseInt(result.count, 10);

//       if (!pmids.length) {
//         return { articles: [], total };
//       }

//       // STEP 2 — FETCH DETAILS
//       const fetchRes = await axios.get(
//         "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
//         {
//           params: {
//             db: "pubmed",
//             id: pmids.join(","),
//             rettype: "abstract",
//             retmode: "xml",
//           },
//         }
//       );

//       const parser = new DOMParser();
//       const xml = parser.parseFromString(fetchRes.data, "text/xml");

//       const articles = Array.from(
//         xml.querySelectorAll("PubmedArticle")
//       ).map((article) => {
//         const getText = (selector) =>
//           article.querySelector(selector)?.textContent || "";

//         const pmcid =
//           article
//             .querySelector("ArticleId[IdType='pmc']")
//             ?.textContent || null;

//         return {
//           id: getText("PMID"),
//           pmcid,
//           title: getText("ArticleTitle"),
//           abstract:
//             article.querySelector("AbstractText")?.textContent ||
//             "No abstract available.",
//           journal: getText("Journal Title"),
//           year: getText("PubDate Year"),
//           authors: Array.from(article.querySelectorAll("Author"))
//             .map(
//               (a) =>
//                 `${a.querySelector("ForeName")?.textContent || ""} ${a.querySelector("LastName")?.textContent || ""
//                 }`
//             )
//             .join(", "),
//         };
//       });


//       return { articles, total };
//     },
//     enabled: !!query,
//     keepPreviousData: true,
//     staleTime: 1000 * 60 * 5,
//   });
// }




import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function usePubMedSearch(query, page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ["pubmed", query, page],

    queryFn: async () => {
      if (!query?.trim()) {
        return { articles: [], total: 0 };
      }

      const retstart = (page - 1) * pageSize;

      // -------------------------------
      // STEP 1 — SEARCH FOR PMIDs
      // -------------------------------
      const searchRes = await axios.get(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi",
        {
          params: {
            db: "pubmed",
            term: query,
            retmax: pageSize,
            retstart,
            retmode: "json",
          },
        }
      );

      const { idlist, count } = searchRes.data.esearchresult;
      const total = parseInt(count, 10);

      if (!idlist.length) {
        return { articles: [], total };
      }

      // -------------------------------
      // STEP 2 — FETCH ARTICLE DETAILS
      // -------------------------------
      const fetchRes = await axios.get(
        "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi",
        {
          params: {
            db: "pubmed",
            id: idlist.join(","),
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

          // PMC ID for PDF download
          const pmcidRaw =
            article.querySelector("ArticleId[IdType='pmc']")?.textContent ||
            null;
          const pmcid = pmcidRaw
            ?.replace(/pmc-id:\s*/i, "")
            .replace(/;/g, "");

          // Authors
          const authors = Array.from(article.querySelectorAll("Author"))
            .map(
              (a) =>
                `${a.querySelector("ForeName")?.textContent || ""} ${
                  a.querySelector("LastName")?.textContent || ""
                }`
            )
            .join(", ");

          return {
            id: getText("PMID"),
            pmcid,
            title: getText("ArticleTitle"),
            abstract:
              article.querySelector("AbstractText")?.textContent ||
              "No abstract available.",
            journal: getText("Journal Title") || "Unknown Journal",
            year: getText("PubDate Year") || "",
            authors: authors || "Unknown",
            pdf: pmcid
              ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcid}/pdf`
              : null,
            pubmed: `https://pubmed.ncbi.nlm.nih.gov/${getText("PMID")}/`,
          };
        }
      );

      return { articles, total };
    },

    enabled: !!query,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
}
