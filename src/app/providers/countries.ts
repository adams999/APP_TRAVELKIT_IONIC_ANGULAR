import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Countries {
    getCountries() {

        let countries = [
            {
                "iso_country": "AF",
                "description": "Afghanistan"
            },
            {
                "iso_country": "AX",
                "description": "Aland Islands"
            },
            {
                "iso_country": "AL",
                "description": "Albania"
            },
            {
                "iso_country": "DZ",
                "description": "Algeria"
            },
            {
                "iso_country": "AS",
                "description": "American Samoa"
            },
            {
                "iso_country": "AD",
                "description": "Andorra"
            },
            {
                "iso_country": "AO",
                "description": "Angola"
            },
            {
                "iso_country": "AI",
                "description": "Anguilla"
            },
            {
                "iso_country": "AQ",
                "description": "Antarctica"
            },
            {
                "iso_country": "AG",
                "description": "Antigua and Barbuda"
            },
            {
                "iso_country": "AR",
                "description": "Argentina"
            },
            {
                "iso_country": "AM",
                "description": "Armenia"
            },
            {
                "iso_country": "AW",
                "description": "Aruba"
            },
            {
                "iso_country": "AU",
                "description": "Australia"
            },
            {
                "iso_country": "AT",
                "description": "Austria"
            },
            {
                "iso_country": "AZ",
                "description": "Azerbaijan"
            },
            {
                "iso_country": "BS",
                "description": "Bahamas"
            },
            {
                "iso_country": "BH",
                "description": "Bahrain"
            },
            {
                "iso_country": "BD",
                "description": "Bangladesh"
            },
            {
                "iso_country": "BB",
                "description": "Barbados"
            },
            {
                "iso_country": "BY",
                "description": "Belarus"
            },
            {
                "iso_country": "BE",
                "description": "Belgium"
            },
            {
                "iso_country": "BZ",
                "description": "Belize"
            },
            {
                "iso_country": "BJ",
                "description": "Benin"
            },
            {
                "iso_country": "BM",
                "description": "Bermuda"
            },
            {
                "iso_country": "BT",
                "description": "Bhutan"
            },
            {
                "iso_country": "BO",
                "description": "Bolivia"
            },
            {
                "iso_country": "BA",
                "description": "Bosnia and Herzegovina"
            },
            {
                "iso_country": "BW",
                "description": "Botswana"
            },
            {
                "iso_country": "BV",
                "description": "Bouvet Island"
            },
            {
                "iso_country": "BR",
                "description": "Brazil"
            },
            {
                "iso_country": "IO",
                "description": "British Indian Ocean Territory"
            },
            {
                "iso_country": "VG",
                "description": "British Virgin Islands"
            },
            {
                "iso_country": "BN",
                "description": "Brunei"
            },
            {
                "iso_country": "BG",
                "description": "Bulgaria"
            },
            {
                "iso_country": "BF",
                "description": "Burkina Faso"
            },
            {
                "iso_country": "BI",
                "description": "Burundi"
            },
            {
                "iso_country": "KH",
                "description": "Cambodia"
            },
            {
                "iso_country": "CM",
                "description": "Cameroon"
            },
            {
                "iso_country": "CA",
                "description": "Canada"
            },
            {
                "iso_country": "CV",
                "description": "Cape Verde"
            },
            {
                "iso_country": "KY",
                "description": "Cayman Islands"
            },
            {
                "iso_country": "CF",
                "description": "Central African Republic"
            },
            {
                "iso_country": "TD",
                "description": "Chad"
            },
            {
                "iso_country": "CL",
                "description": "Chile"
            },
            {
                "iso_country": "CN",
                "description": "China"
            },
            {
                "iso_country": "CX",
                "description": "Christmas Island"
            },
            {
                "iso_country": "CC",
                "description": "Cocos Islands"
            },
            {
                "iso_country": "CO",
                "description": "Colombia"
            },
            {
                "iso_country": "KM",
                "description": "Comoros"
            },
            {
                "iso_country": "CK",
                "description": "Cook Islands"
            },
            {
                "iso_country": "CR",
                "description": "Costa Rica"
            },
            {
                "iso_country": "HR",
                "description": "Croatia"
            },
            {
                "iso_country": "CU",
                "description": "Cuba"
            },
            {
                "iso_country": "CW",
                "description": "Curaçao"
            },
            {
                "iso_country": "CY",
                "description": "Cyprus"
            },
            {
                "iso_country": "CZ",
                "description": "Czech Republic"
            },
            {
                "iso_country": "CD",
                "description": "Democratic Republic of the Congo"
            },
            {
                "iso_country": "DK",
                "description": "Denmark"
            },
            {
                "iso_country": "DJ",
                "description": "Djibouti"
            },
            {
                "iso_country": "DM",
                "description": "Dominica"
            },
            {
                "iso_country": "DO",
                "description": "Dominican Republic"
            },
            {
                "iso_country": "TL",
                "description": "East Timor"
            },
            {
                "iso_country": "EC",
                "description": "Ecuador"
            },
            {
                "iso_country": "EG",
                "description": "Egypt"
            },
            {
                "iso_country": "SV",
                "description": "El Salvador"
            },
            {
                "iso_country": "GQ",
                "description": "Equatorial Guinea"
            },
            {
                "iso_country": "ER",
                "description": "Eritrea"
            },
            {
                "iso_country": "EE",
                "description": "Estonia"
            },
            {
                "iso_country": "ET",
                "description": "Ethiopia"
            },
            {
                "iso_country": "FK",
                "description": "Falkland Islands"
            },
            {
                "iso_country": "FO",
                "description": "Faroe Islands"
            },
            {
                "iso_country": "FJ",
                "description": "Fiji"
            },
            {
                "iso_country": "FI",
                "description": "Finland"
            },
            {
                "iso_country": "FR",
                "description": "France"
            },
            {
                "iso_country": "GF",
                "description": "French Guiana"
            },
            {
                "iso_country": "PF",
                "description": "French Polynesia"
            },
            {
                "iso_country": "TF",
                "description": "French Southern Territories"
            },
            {
                "iso_country": "GA",
                "description": "Gabon"
            },
            {
                "iso_country": "GM",
                "description": "Gambia"
            },
            {
                "iso_country": "GE",
                "description": "Georgia"
            },
            {
                "iso_country": "DE",
                "description": "Germany"
            },
            {
                "iso_country": "GH",
                "description": "Ghana"
            },
            {
                "iso_country": "GI",
                "description": "Gibraltar"
            },
            {
                "iso_country": "GR",
                "description": "Greece"
            },
            {
                "iso_country": "GL",
                "description": "Greenland"
            },
            {
                "iso_country": "GD",
                "description": "Grenada"
            },
            {
                "iso_country": "GP",
                "description": "Guadeloupe"
            },
            {
                "iso_country": "GU",
                "description": "Guam"
            },
            {
                "iso_country": "GT",
                "description": "Guatemala"
            },
            {
                "iso_country": "GG",
                "description": "Guernsey"
            },
            {
                "iso_country": "GN",
                "description": "Guinea"
            },
            {
                "iso_country": "GW",
                "description": "Guinea-Bissau"
            },
            {
                "iso_country": "GY",
                "description": "Guyana"
            },
            {
                "iso_country": "HT",
                "description": "Haiti"
            },
            {
                "iso_country": "HM",
                "description": "Heard Island and McDonald Islands"
            },
            {
                "iso_country": "HN",
                "description": "Honduras"
            },
            {
                "iso_country": "HK",
                "description": "Hong Kong"
            },
            {
                "iso_country": "HU",
                "description": "Hungary"
            },
            {
                "iso_country": "IS",
                "description": "Iceland"
            },
            {
                "iso_country": "IN",
                "description": "India"
            },
            {
                "iso_country": "ID",
                "description": "Indonesia"
            },
            {
                "iso_country": "IR",
                "description": "Iran"
            },
            {
                "iso_country": "IQ",
                "description": "Iraq"
            },
            {
                "iso_country": "IE",
                "description": "Ireland"
            },
            {
                "iso_country": "IM",
                "description": "Isle of Man"
            },
            {
                "iso_country": "IL",
                "description": "Israel"
            },
            {
                "iso_country": "IT",
                "description": "Italy"
            },
            {
                "iso_country": "CI",
                "description": "Ivory Coast"
            },
            {
                "iso_country": "JM",
                "description": "Jamaica"
            },
            {
                "iso_country": "JP",
                "description": "Japan"
            },
            {
                "iso_country": "JE",
                "description": "Jersey"
            },
            {
                "iso_country": "JO",
                "description": "Jordan"
            },
            {
                "iso_country": "KZ",
                "description": "Kazakhstan"
            },
            {
                "iso_country": "KE",
                "description": "Kenya"
            },
            {
                "iso_country": "KI",
                "description": "Kiribati"
            },
            {
                "iso_country": "XK",
                "description": "Kosovo"
            },
            {
                "iso_country": "KW",
                "description": "Kuwait"
            },
            {
                "iso_country": "KG",
                "description": "Kyrgyzstan"
            },
            {
                "iso_country": "LA",
                "description": "Laos"
            },
            {
                "iso_country": "LV",
                "description": "Latvia"
            },
            {
                "iso_country": "LB",
                "description": "Lebanon"
            },
            {
                "iso_country": "LS",
                "description": "Lesotho"
            },
            {
                "iso_country": "LR",
                "description": "Liberia"
            },
            {
                "iso_country": "LY",
                "description": "Libya"
            },
            {
                "iso_country": "LI",
                "description": "Liechtenstein"
            },
            {
                "iso_country": "LT",
                "description": "Lithuania"
            },
            {
                "iso_country": "LU",
                "description": "Luxembourg"
            },
            {
                "iso_country": "MO",
                "description": "Macao"
            },
            {
                "iso_country": "MK",
                "description": "Macedonia"
            },
            {
                "iso_country": "MG",
                "description": "Madagascar"
            },
            {
                "iso_country": "MW",
                "description": "Malawi"
            },
            {
                "iso_country": "MY",
                "description": "Malaysia"
            },
            {
                "iso_country": "MV",
                "description": "Maldives"
            },
            {
                "iso_country": "ML",
                "description": "Mali"
            },
            {
                "iso_country": "MT",
                "description": "Malta"
            },
            {
                "iso_country": "MH",
                "description": "Marshall Islands"
            },
            {
                "iso_country": "MQ",
                "description": "Martinique"
            },
            {
                "iso_country": "MR",
                "description": "Mauritania"
            },
            {
                "iso_country": "MU",
                "description": "Mauritius"
            },
            {
                "iso_country": "YT",
                "description": "Mayotte"
            },
            {
                "iso_country": "MX",
                "description": "Mexico"
            },
            {
                "iso_country": "FM",
                "description": "Micronesia"
            },
            {
                "iso_country": "MD",
                "description": "Moldova"
            },
            {
                "iso_country": "MC",
                "description": "Monaco"
            },
            {
                "iso_country": "MN",
                "description": "Mongolia"
            },
            {
                "iso_country": "ME",
                "description": "Montenegro"
            },
            {
                "iso_country": "MS",
                "description": "Montserrat"
            },
            {
                "iso_country": "MA",
                "description": "Morocco"
            },
            {
                "iso_country": "MZ",
                "description": "Mozambique"
            },
            {
                "iso_country": "MM",
                "description": "Myanmar"
            },
            {
                "iso_country": "NA",
                "description": "Namibia"
            },
            {
                "iso_country": "NR",
                "description": "Nauru"
            },
            {
                "iso_country": "NP",
                "description": "Nepal"
            },
            {
                "iso_country": "NL",
                "description": "Netherlands"
            },
            {
                "iso_country": "AN",
                "description": "Netherlands Antilles"
            },
            {
                "iso_country": "NC",
                "description": "New Caledonia"
            },
            {
                "iso_country": "NZ",
                "description": "New Zealand"
            },
            {
                "iso_country": "NI",
                "description": "Nicaragua"
            },
            {
                "iso_country": "NE",
                "description": "Niger"
            },
            {
                "iso_country": "NG",
                "description": "Nigeria"
            },
            {
                "iso_country": "NU",
                "description": "Niue"
            },
            {
                "iso_country": "NF",
                "description": "Norfolk Island"
            },
            {
                "iso_country": "KP",
                "description": "North Korea"
            },
            {
                "iso_country": "MP",
                "description": "Northern Mariana Islands"
            },
            {
                "iso_country": "NO",
                "description": "Norway"
            },
            {
                "iso_country": "OM",
                "description": "Oman"
            },
            {
                "iso_country": "PK",
                "description": "Pakistan"
            },
            {
                "iso_country": "PW",
                "description": "Palau"
            },
            {
                "iso_country": "PS",
                "description": "Palestinian Territory"
            },
            {
                "iso_country": "PA",
                "description": "Panama"
            },
            {
                "iso_country": "PG",
                "description": "Papua New Guinea"
            },
            {
                "iso_country": "PY",
                "description": "Paraguay"
            },
            {
                "iso_country": "PE",
                "description": "Peru"
            },
            {
                "iso_country": "PH",
                "description": "Philippines"
            },
            {
                "iso_country": "PN",
                "description": "Pitcairn"
            },
            {
                "iso_country": "PL",
                "description": "Poland"
            },
            {
                "iso_country": "PT",
                "description": "Portugal"
            },
            {
                "iso_country": "PR",
                "description": "Puerto Rico"
            },
            {
                "iso_country": "QA",
                "description": "Qatar"
            },
            {
                "iso_country": "CG",
                "description": "Republic of the Congo"
            },
            {
                "iso_country": "RE",
                "description": "Reunion"
            },
            {
                "iso_country": "RO",
                "description": "Romania"
            },
            {
                "iso_country": "RU",
                "description": "Russia"
            },
            {
                "iso_country": "RW",
                "description": "Rwanda"
            },
            {
                "iso_country": "BL",
                "description": "Saint BarthÃƒÂ©lemy"
            },
            {
                "iso_country": "SH",
                "description": "Saint Helena"
            },
            {
                "iso_country": "KN",
                "description": "Saint Kitts and Nevis"
            },
            {
                "iso_country": "LC",
                "description": "Saint Lucia"
            },
            {
                "iso_country": "MF",
                "description": "Saint Martin"
            },
            {
                "iso_country": "PM",
                "description": "Saint Pierre and Miquelon"
            },
            {
                "iso_country": "VC",
                "description": "Saint Vincent and the Grenadines"
            },
            {
                "iso_country": "WS",
                "description": "Samoa"
            },
            {
                "iso_country": "SM",
                "description": "San Marino"
            },
            {
                "iso_country": "ST",
                "description": "Sao Tome and Principe"
            },
            {
                "iso_country": "SA",
                "description": "Saudi Arabia"
            },
            {
                "iso_country": "SN",
                "description": "Senegal"
            },
            {
                "iso_country": "RS",
                "description": "Serbia"
            },
            {
                "iso_country": "CS",
                "description": "Serbia and Montenegro"
            },
            {
                "iso_country": "SC",
                "description": "Seychelles"
            },
            {
                "iso_country": "SL",
                "description": "Sierra Leone"
            },
            {
                "iso_country": "SG",
                "description": "Singapore"
            },
            {
                "iso_country": "SK",
                "description": "Slovakia"
            },
            {
                "iso_country": "SI",
                "description": "Slovenia"
            },
            {
                "iso_country": "SB",
                "description": "Solomon Islands"
            },
            {
                "iso_country": "SO",
                "description": "Somalia"
            },
            {
                "iso_country": "ZA",
                "description": "South Africa"
            },
            {
                "iso_country": "GS",
                "description": "South Georgia and the South Sandwich Islands"
            },
            {
                "iso_country": "KR",
                "description": "South Korea"
            },
            {
                "iso_country": "ES",
                "description": "Spain"
            },
            {
                "iso_country": "LK",
                "description": "Sri Lanka"
            },
            {
                "iso_country": "SD",
                "description": "Sudan"
            },
            {
                "iso_country": "SR",
                "description": "Suriname"
            },
            {
                "iso_country": "SJ",
                "description": "Svalbard and Jan Mayen"
            },
            {
                "iso_country": "SZ",
                "description": "Swaziland"
            },
            {
                "iso_country": "SE",
                "description": "Sweden"
            },
            {
                "iso_country": "CH",
                "description": "Switzerland"
            },
            {
                "iso_country": "SY",
                "description": "Syria"
            },
            {
                "iso_country": "TW",
                "description": "Taiwan"
            },
            {
                "iso_country": "TJ",
                "description": "Tajikistan"
            },
            {
                "iso_country": "TZ",
                "description": "Tanzania"
            },
            {
                "iso_country": "TH",
                "description": "Thailand"
            },
            {
                "iso_country": "TG",
                "description": "Togo"
            },
            {
                "iso_country": "TK",
                "description": "Tokelau"
            },
            {
                "iso_country": "TO",
                "description": "Tonga"
            },
            {
                "iso_country": "TT",
                "description": "Trinidad and Tobago"
            },
            {
                "iso_country": "TN",
                "description": "Tunisia"
            },
            {
                "iso_country": "TR",
                "description": "Turkey"
            },
            {
                "iso_country": "TM",
                "description": "Turkmenistan"
            },
            {
                "iso_country": "TC",
                "description": "Turks and Caicos Islands"
            },
            {
                "iso_country": "TV",
                "description": "Tuvalu"
            },
            {
                "iso_country": "VI",
                "description": "U.S. Virgin Islands"
            },
            {
                "iso_country": "UG",
                "description": "Uganda"
            },
            {
                "iso_country": "UA",
                "description": "Ukraine"
            },
            {
                "iso_country": "AE",
                "description": "United Arab Emirates"
            },
            {
                "iso_country": "GB",
                "description": "United Kingdom"
            },
            {
                "iso_country": "US",
                "description": "United States"
            },
            {
                "iso_country": "UM",
                "description": "United States Minor Outlying Islands"
            },
            {
                "iso_country": "UC",
                "description": "United States/Cobro Revertido"
            },
            {
                "iso_country": "UY",
                "description": "Uruguay"
            },
            {
                "iso_country": "UZ",
                "description": "Uzbekistan"
            },
            {
                "iso_country": "VU",
                "description": "Vanuatu"
            },
            {
                "iso_country": "VA",
                "description": "Vatican"
            },
            {
                "iso_country": "VE",
                "description": "Venezuela"
            },
            {
                "iso_country": "VN",
                "description": "Vietnam"
            },
            {
                "iso_country": "WF",
                "description": "Wallis and Futuna"
            },
            {
                "iso_country": "EH",
                "description": "Western Sahara"
            },
            {
                "iso_country": "YE",
                "description": "Yemen"
            },
            {
                "iso_country": "ZM",
                "description": "Zambia"
            },
            {
                "iso_country": "ZW",
                "description": "Zimbabwe"
            }
        ];
        return countries;
    }
}
