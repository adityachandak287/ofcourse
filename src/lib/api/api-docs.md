# API Docs

https://classes.cornell.edu/content/FA26/api-details

## Examples

### Get all rosters

https://classes.cornell.edu/api/2.0/config/rosters.json

```json
{
  "status": "success",
  "data": {
    "rosters": [
      {
        "slug": "FA25",
        "isDefaultRoster": "N",
        "strm": "2909",
        "descr": "Fall 2025",
        "descrshort": "2025FA",
        "courseLastTermsOffered": 4,
        "defaultSessionCode": "1",
        "defaultCampus": "MAIN",
        "defaultLocation": "ITH",
        "defaultInstructionMode": "P",
        "sharing": "N",
        "archiveMode": "Y",
        "version": {
          "status": "COMPLETE",
          "referenceDttm": "2026-01-04T19:07:33-0500",
          "catalogDttm": null,
          "descriptionSource": "REFERENCE",
          "showCatalogNote": "Y",
          "catalogCourseNote": null,
          "catalog": [],
          "exploreTileVersions": []
        },
        "lastModifiedDttm": "2026-04-13T11:19:17-0400",
        "classMaterialSupport": "N",
        "classMaterialAutoAction": "0"
      },
      {
        "slug": "WI26",
        "isDefaultRoster": "N",
        "strm": "2916",
        "descr": "Winter 2026",
        "descrshort": "2026WI",
        "courseLastTermsOffered": 4,
        "defaultSessionCode": "1",
        "defaultCampus": "MAIN",
        "defaultLocation": "ITH",
        "defaultInstructionMode": "P",
        "sharing": "Y",
        "archiveMode": "N",
        "version": {
          "status": "COMPLETE",
          "referenceDttm": "2026-01-19T19:07:17-0500",
          "catalogDttm": null,
          "descriptionSource": "REFERENCE",
          "showCatalogNote": "Y",
          "catalogCourseNote": null,
          "catalog": [],
          "exploreTileVersions": []
        },
        "lastModifiedDttm": "2026-04-13T11:19:17-0400",
        "classMaterialSupport": "N",
        "classMaterialAutoAction": "0"
      },
      {
        "slug": "SP26",
        "isDefaultRoster": "N",
        "strm": "2923",
        "descr": "Spring 2026",
        "descrshort": "2026SP",
        "courseLastTermsOffered": 4,
        "defaultSessionCode": "1",
        "defaultCampus": "MAIN",
        "defaultLocation": "ITH",
        "defaultInstructionMode": "P",
        "sharing": "Y",
        "archiveMode": "N",
        "version": {
          "status": "COMPLETE",
          "referenceDttm": "2026-04-13T19:07:20-0400",
          "catalogDttm": null,
          "descriptionSource": "REFERENCE",
          "showCatalogNote": "Y",
          "catalogCourseNote": null,
          "catalog": [],
          "exploreTileVersions": []
        },
        "lastModifiedDttm": "2026-04-14T08:41:14-0400",
        "classMaterialSupport": "N",
        "classMaterialAutoAction": "0"
      },
      {
        "slug": "SU26",
        "isDefaultRoster": "N",
        "strm": "2930",
        "descr": "Summer 2026",
        "descrshort": "2026SU",
        "courseLastTermsOffered": 4,
        "defaultSessionCode": "1",
        "defaultCampus": "MAIN",
        "defaultLocation": "ITH",
        "defaultInstructionMode": "P",
        "sharing": "Y",
        "archiveMode": "N",
        "version": {
          "status": "COMPLETE",
          "referenceDttm": "2026-04-13T19:07:20-0400",
          "catalogDttm": null,
          "descriptionSource": "REFERENCE",
          "showCatalogNote": "Y",
          "catalogCourseNote": null,
          "catalog": [],
          "exploreTileVersions": []
        },
        "lastModifiedDttm": "2026-04-14T08:41:14-0400",
        "classMaterialSupport": "N",
        "classMaterialAutoAction": "0"
      },
      {
        "slug": "FA26",
        "isDefaultRoster": "Y",
        "strm": "2937",
        "descr": "Fall 2026",
        "descrshort": "2026FA",
        "courseLastTermsOffered": 4,
        "defaultSessionCode": "1",
        "defaultCampus": "MAIN",
        "defaultLocation": "ITH",
        "defaultInstructionMode": "P",
        "sharing": "Y",
        "archiveMode": "N",
        "version": {
          "status": "COMPLETE",
          "referenceDttm": "2026-04-14T08:26:10-0400",
          "catalogDttm": null,
          "descriptionSource": "REFERENCE",
          "showCatalogNote": "Y",
          "catalogCourseNote": null,
          "catalog": [],
          "exploreTileVersions": []
        },
        "lastModifiedDttm": "2026-04-14T08:41:32-0400",
        "classMaterialSupport": "N",
        "classMaterialAutoAction": "0"
      }
      // ... truncated
    ]
  },
  "message": null,
  "meta": {
    "copyright": "Cornell University, Office of the University Registrar"
  }
}
```

## Get all subjects for roster

https://classes.cornell.edu/api/2.0/config/subjects.json?roster=SP26

```json
{
  "status": "success",
  "data": {
    "subjects": [
      {
        "value": "AAS",
        "descr": "Asian American Studies",
        "descrformal": "Asian American Studies"
      },
      {
        "value": "ENGL",
        "descr": "English",
        "descrformal": "English"
      },
      {
        "value": "ENGRC",
        "descr": "Engineering Communications",
        "descrformal": "Engineering Communications"
      }
      // ... truncated
    ]
  },
  "message": null,
  "meta": {
    "copyright": "Cornell University, Office of the University Registrar",
    "referenceDttm": "2026-04-13T19:07:20-0400"
  }
}
```

## Search classes for roster and subject

https://classes.cornell.edu/api/2.0/search/classes.json?roster=SP26&subject=CS

```json
{
  "status": "success",
  "data": {
    "classes": [
      {
        "strm": 2923,
        "crseId": 358526,
        "crseOfferNbr": 1,
        "subject": "CS",
        "catalogNbr": "1110",
        "titleShort": "Intro Computing: Design & Dev",
        "titleLong": "Introduction to Computing: A Design and Development Perspective",
        "acadCareer": "UG",
        "acadGroup": "EN"
      },
      // ... truncated
    ]
  },
  "message": null,
  "meta": {
    "copyright": "Cornell University, Office of the University Registrar",
    "rosterDttm": "2026-04-13T19:07:20-0400"
  }
}
```
---
## Error
```json
{
  "status": "error",
  "data": null,
  "message": "Subject is required",
  "meta": {
    "copyright": "Cornell University, Office of the University Registrar"
  }
}
```
