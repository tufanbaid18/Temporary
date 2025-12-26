import { useState } from "react";
import "./ScholarSearch.css";
import ScholarSearchFilter from "./ScholarSearchFilter";
import pdfIcon from "../../assets/pdf-icon.png";
import { usePubMedSearch } from "../../hooks/usePubMedSearch";
import AddToShelfModal from "../add-to-bookshelf/AddToShelfModal";

export default function ScholarSearch() {
  const [queryInput, setQueryInput] = useState("");
  const [query, setQuery] = useState("");
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const { data, isLoading, isError } = usePubMedSearch(query);

  const [filters, setFilters] = useState({
    textAvailability: "all",
    articleTypes: [],
    pubDate: "any",
    customFrom: "",
    customTo: "",
    species: "all",
    language: "",
    sortBy: "relevance",
  });

  // ---------------------------------------------
  // FORMAT PUBMED DATA INTO YOUR TEMPLATE FORMAT
  // ---------------------------------------------
  // const formattedResults = (data || []).map((art) => {
  //   const authors = art.authors?.map((a) => a.name).join(", ") || "Unknown";
  //   const pmcidObj = art.articleids?.find((i) => i.idtype === "pmcid");
  //   if (pmcidObj) {
  //     pmcidObj.value = pmcidObj.value.replace(/pmc-id: /, '');
  //     pmcidObj.value = pmcidObj.value.replace(/;/, '');
  //   }

  //   return {
  //     id: art.uid,
  //     title: art.title,
  //     authors,
  //     journal: art.fulljournalname || "Unknown Journal",
  //     year: art.pubdate?.substring(0, 4) || "",
  //     abstract: art.abstract || "No abstract available.",
  //     pdf: pmcidObj
  //       ? `https://www.ncbi.nlm.nih.gov/pmc/articles/${pmcidObj.value}/pdf`
  //       : null,
  //   };
  // });

  const formattedResults = (data || []).map((art) => ({
    id: art.id,
    title: art.title,
    authors: art.authors || "Unknown",
    journal: art.journal || "Unknown Journal",
    year: art.year || "",
    abstract: art.abstract,
    pdf: art.id
      ? `https://pubmed.ncbi.nlm.nih.gov/${art.id}/`
      : null,
  }));




  return (
    <div className="container py-5 scholar-page">
      <div className="row">

        {/* LEFT */}
        <div className="col-md-8 left-pane">

          {/* SEARCH BOX */}
          <div className="search-section text-center mb-5">
            <div className="search-section text-center mb-5">
              <div className="mb-4 text-center">
                <img
                  src="images/plasma.jpeg"
                  alt="PubMed Search"
                  style={{
                    height: "90px",
                    objectFit: "contain"
                  }}
                />

                <div
                  className="text-muted"
                  style={{ fontSize: "0.9rem", marginTop: "-2px", letterSpacing: "0.8px" }}
                >
                  Explore millions of biomedical papers
                </div>
              </div>
            </div>

            {/* <div className="d-flex justify-content-center">
              <input
                type="text"
                placeholder="Search PubMed..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="search-input form-control"
              />

              <button
                className="btn btn-primary ms-2 btn-search"
                onClick={() => setQuery(queryInput)}
              >
                <i className="ri-search-line"></i> Search
              </button>
            </div> */}

            <form
              className="d-flex justify-content-center"
              onSubmit={(e) => {
                e.preventDefault();      // stop page reload
                setQuery(queryInput);    // trigger search
              }}
            >
              <input
                type="text"
                placeholder="Search Plasma..."
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="search-input form-control"
              />

              <button
                type="submit"
                className="btn btn-primary ms-2 btn-search"
              >
                <i className="ri-search-line"></i> Search
              </button>
            </form>



          </div>


          {/* LOADING / ERROR */}
          {isLoading && (
            <div className="loading-dots">
              <span></span><span></span><span></span>
            </div>
          )}
          {isError && <p>Error fetching articles.</p>}

          {/* BEFORE SEARCH */}
          {!query && (
            <div className="text-center text-muted py-5 placeholder-box">
              <i className="ri-search-eye-line fs-1 d-block mb-3"></i>
              Start by entering a search query…
            </div>
          )}

          {/* NO RESULTS */}
          {query && formattedResults.length === 0 && !isLoading && (
            <p className="text-center text-muted">No articles found.</p>
          )}

          {/* ------------------------------ */}
          {/* RESULTS */}
          {/* ------------------------------ */}
          {formattedResults.map((r) => (
            <div
              key={r.id}
              className="article-card shadow-sm p-4 mb-4 rounded"
            >
              <div className="d-flex align-items-start gap-3">

                {/* PDF ICON */}
                <img src={pdfIcon} className="pdf-icon" alt="pdf" />

                <div className="flex-grow-1">

                  {/* TITLE + BOOKMARK */}
                  <div className="d-flex justify-content-between">
                    <h5 className="article-title colored-title">{r.title}</h5>

                    <button className="btn btn-light border bookmark-btn">
                      <i className="ri-bookmark-line"></i>
                    </button>
                  </div>

                  <div className="author-line small mb-2">
                    {r.authors} · <strong>{r.journal}</strong> ({r.year})
                  </div>


                  <p className="abstract-text">
                    {(showMore ? r.abstract : r.abstract?.slice(0, 150)) || "No abstract available"}
                    {r.abstract?.length > 50 && (
                      <span
                        onClick={() => setShowMore(!showMore)}
                        style={{ color: "#007bffff", cursor: "pointer" }}
                      >
                        {showMore ? " ...Read less" : " ...Read more"}
                      </span>
                    )}
                  </p>


                  {/* PDF BUTTON */}
                  {r.pdf ? (
                    <a
                      href={r.pdf}
                      target="_blank"
                      className="btn btn-sm btn-outline-primary mt-2"
                    >
                      <i className="ri-file-download-line me-1"></i>
                      Download PDF
                    </a>
                  ) : (
                    <button
                      className="btn btn-sm btn-outline-secondary mt-2"
                      disabled
                    >
                      <i className="ri-file-warning-line me-1"></i>
                      PDF Not Available
                    </button>
                  )}

                  {/* ADD TO SHELF */}
                  <button
                    className="btn btn-sm btn-outline-success mt-2 ms-2"
                    onClick={() => {
                      setSelectedArticle(r);
                      setShowShelfModal(true);
                    }}
                  >
                    <i className="ri-bookmark-line me-1"></i>
                    Add to Shelf
                  </button>

                </div>
              </div>
            </div>
          ))}

        </div>

        {/* RIGHT FILTERS */}
        {/* <div className="col-md-4">
          <ScholarSearchFilter filters={filters} setFilters={setFilters} />
        </div> */}
      </div>
      {showShelfModal && selectedArticle && (
        <AddToShelfModal
          article={selectedArticle}
          onClose={() => {
            setShowShelfModal(false);
            setSelectedArticle(null);
          }}
        />
      )}

    </div>
  );
}