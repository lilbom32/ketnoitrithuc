export interface MuseumDetail {
  i18nTitleKey: string;
  i18nDescKey: string;
}

export interface MuseumTab {
  id: string;
  image: string;
  i18nKey: string;
  i18nContentKey: string;
  details: MuseumDetail[];
}

export interface MuseumConfig {
  title: string;
  subtitle: string;
  tabs: MuseumTab[];
}

export const museumConfig: MuseumConfig = {
  title: "Hành trình phát triển",
  subtitle: "VỀ CÂU LẠC BỘ TRI THỨC DU LỊCH",
  tabs: [
    {
      id: "history",
      image: "/images/resource-3.jpg",
      i18nKey: "about.tabs.history",
      i18nContentKey: "about.intro",
      details: [
        {
          i18nTitleKey: "nav.dropdown.collaboration",
          i18nDescKey: "about.quote"
        },
        {
          i18nTitleKey: "nav.dropdown.strategicPartners",
          i18nDescKey: "about.timeline.2026"
        },
      ],
    },
    {
      id: "orgChart",
      image: "/images/founder.jpg",
      i18nKey: "nav.dropdown.orgChart",
      i18nContentKey: "about.orgChart.title",
      details: [
        {
          i18nTitleKey: "about.orgChart.leadership",
          i18nDescKey: "about.tabs.leadership"
        },
        {
          i18nTitleKey: "about.orgChart.training",
          i18nDescKey: "about.tabs.training"
        },
      ],
    },
    {
      id: "advisory",
      image: "/images/founder.jpg",
      i18nKey: "nav.dropdown.advisoryDept",
      i18nContentKey: "about.orgChart.advisory",
      details: [
        {
          i18nTitleKey: "about.tabs.advisory",
          i18nDescKey: "nav.dropdown.industryTrends"
        },
        {
          i18nTitleKey: "nav.dropdown.deepAnalysis",
          i18nDescKey: "nav.dropdown.digitalLibrary"
        },
      ],
    },
     {
      id: "culture",
      image: "/images/hero-1.jpg",
      i18nKey: "nav.dropdown.culture",
      i18nContentKey: "about.tabs.culture",
      details: [
        {
          i18nTitleKey: "nav.dropdown.scholarships",
          i18nDescKey: "about.timeline.2024"
        },
        {
          i18nTitleKey: "nav.dropdown.archive",
          i18nDescKey: "about.timeline.2022"
        },
      ],
    },
  ],
};
