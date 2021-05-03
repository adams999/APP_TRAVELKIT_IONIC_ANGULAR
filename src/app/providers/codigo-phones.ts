import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CodPhones {

    constructor() {
        console.log('Hello CodPhones Provider');
    }

    getCodPhones() {

        let codigos = [
            {
                "cod_phone": "+93",
                "iso_country": "AF",
                "description": "Afghanistan"
            },
            {
                "cod_phone": "+340",
                "iso_country": "AX",
                "description": "Aland Islands"
            },
            {
                "cod_phone": "+355",
                "iso_country": "AL",
                "description": "Albania"
            },
            {
                "cod_phone": "+213",
                "iso_country": "DZ",
                "description": "Algeria"
            },
            {
                "cod_phone": "+683",
                "iso_country": "AS",
                "description": "American Samoa"
            },
            {
                "cod_phone": "+376",
                "iso_country": "AD",
                "description": "Andorra"
            },
            {
                "cod_phone": "+244",
                "iso_country": "AO",
                "description": "Angola"
            },
            {
                "cod_phone": "+263",
                "iso_country": "AI",
                "description": "Anguilla"
            },
            {
                "cod_phone": "+267",
                "iso_country": "AG",
                "description": "Antigua and Barbuda"
            },
            {
                "cod_phone": "+54",
                "iso_country": "AR",
                "description": "Argentina"
            },
            {
                "cod_phone": "+374",
                "iso_country": "AM",
                "description": "Armenia"
            },
            {
                "cod_phone": "+297",
                "iso_country": "AW",
                "description": "Aruba"
            },
            {
                "cod_phone": "+61",
                "iso_country": "AU",
                "description": "Australia"
            },
            {
                "cod_phone": "+43",
                "iso_country": "AT",
                "description": "Austria"
            },
            {
                "cod_phone": "+994",
                "iso_country": "AZ",
                "description": "Azerbaijan"
            },
            {
                "cod_phone": "+241",
                "iso_country": "BS",
                "description": "Bahamas"
            },
            {
                "cod_phone": "+973",
                "iso_country": "BH",
                "description": "Bahrain"
            },
            {
                "cod_phone": "+880",
                "iso_country": "BD",
                "description": "Bangladesh"
            },
            {
                "cod_phone": "+245",
                "iso_country": "BB",
                "description": "Barbados"
            },
            {
                "cod_phone": "+375",
                "iso_country": "BY",
                "description": "Belarus"
            },
            {
                "cod_phone": "+32",
                "iso_country": "BE",
                "description": "Belgium"
            },
            {
                "cod_phone": "+501",
                "iso_country": "BZ",
                "description": "Belize"
            },
            {
                "cod_phone": "+229",
                "iso_country": "BJ",
                "description": "Benin"
            },
            {
                "cod_phone": "+440",
                "iso_country": "BM",
                "description": "Bermuda"
            },
            {
                "cod_phone": "+975",
                "iso_country": "BT",
                "description": "Bhutan"
            },
            {
                "cod_phone": "+591",
                "iso_country": "BO",
                "description": "Bolivia"
            },
            {
                "cod_phone": "+387",
                "iso_country": "BA",
                "description": "Bosnia and Herzegovina"
            },
            {
                "cod_phone": "+267",
                "iso_country": "BW",
                "description": "Botswana"
            },
            {
                "cod_phone": "+55",
                "iso_country": "BR",
                "description": "Brazil"
            },
            {
                "cod_phone": "+246",
                "iso_country": "IO",
                "description": "British Indian Ocean Territory"
            },
            {
                "cod_phone": "+283",
                "iso_country": "VG",
                "description": "British Virgin Islands"
            },
            {
                "cod_phone": "+673",
                "iso_country": "BN",
                "description": "Brunei"
            },
            {
                "cod_phone": "+359",
                "iso_country": "BG",
                "description": "Bulgaria"
            },
            {
                "cod_phone": "+226",
                "iso_country": "BF",
                "description": "Burkina Faso"
            },
            {
                "cod_phone": "+257",
                "iso_country": "BI",
                "description": "Burundi"
            },
            {
                "cod_phone": "+855",
                "iso_country": "KH",
                "description": "Cambodia"
            },
            {
                "cod_phone": "+237",
                "iso_country": "CM",
                "description": "Cameroon"
            },
            {
                "cod_phone": "+001",
                "iso_country": "CA",
                "description": "Canada"
            },
            {
                "cod_phone": "+238",
                "iso_country": "CV",
                "description": "Cape Verde"
            },
            {
                "cod_phone": "+344",
                "iso_country": "KY",
                "description": "Cayman Islands"
            },
            {
                "cod_phone": "+236",
                "iso_country": "CF",
                "description": "Central African Republic"
            },
            {
                "cod_phone": "+235",
                "iso_country": "TD",
                "description": "Chad"
            },
            {
                "cod_phone": "+56",
                "iso_country": "CL",
                "description": "Chile"
            },
            {
                "cod_phone": "+86",
                "iso_country": "CN",
                "description": "China"
            },
            {
                "cod_phone": "+61",
                "iso_country": "CX",
                "description": "Christmas Island"
            },
            {
                "cod_phone": "+61",
                "iso_country": "CC",
                "description": "Cocos Islands"
            },
            {
                "cod_phone": "+57",
                "iso_country": "CO",
                "description": "Colombia"
            },
            {
                "cod_phone": "+269",
                "iso_country": "KM",
                "description": "Comoros"
            },
            {
                "cod_phone": "+682",
                "iso_country": "CK",
                "description": "Cook Islands"
            },
            {
                "cod_phone": "+506",
                "iso_country": "CR",
                "description": "Costa Rica"
            },
            {
                "cod_phone": "+385",
                "iso_country": "HR",
                "description": "Croatia"
            },
            {
                "cod_phone": "+53",
                "iso_country": "CU",
                "description": "Cuba"
            },
            {
                "cod_phone": "+357",
                "iso_country": "CY",
                "description": "Cyprus"
            },
            {
                "cod_phone": "+420",
                "iso_country": "CZ",
                "description": "Czech Republic"
            },
            {
                "cod_phone": "+243",
                "iso_country": "CD",
                "description": "Democratic Republic of the Congo"
            },
            {
                "cod_phone": "+45",
                "iso_country": "DK",
                "description": "Denmark"
            },
            {
                "cod_phone": "+253",
                "iso_country": "DJ",
                "description": "Djibouti"
            },
            {
                "cod_phone": "+766",
                "iso_country": "DM",
                "description": "Dominica"
            },
            {
                "cod_phone": "+1809",
                "iso_country": "DO",
                "description": "Dominican Republic"
            },
            {
                "cod_phone": "+1829",
                "iso_country": "DO",
                "description": "Dominican Republic"
            },
            {
                "cod_phone": "+670",
                "iso_country": "TL",
                "description": "East Timor"
            },
            {
                "cod_phone": "+593",
                "iso_country": "EC",
                "description": "Ecuador"
            },
            {
                "cod_phone": "+20",
                "iso_country": "EG",
                "description": "Egypt"
            },
            {
                "cod_phone": "+503",
                "iso_country": "SV",
                "description": "El Salvador"
            },
            {
                "cod_phone": "+240",
                "iso_country": "GQ",
                "description": "Equatorial Guinea"
            },
            {
                "cod_phone": "+291",
                "iso_country": "ER",
                "description": "Eritrea"
            },
            {
                "cod_phone": "+372",
                "iso_country": "EE",
                "description": "Estonia"
            },
            {
                "cod_phone": "+251",
                "iso_country": "ET",
                "description": "Ethiopia"
            },
            {
                "cod_phone": "+500",
                "iso_country": "FK",
                "description": "Falkland Islands"
            },
            {
                "cod_phone": "+298",
                "iso_country": "FO",
                "description": "Faroe Islands"
            },
            {
                "cod_phone": "+679",
                "iso_country": "FJ",
                "description": "Fiji"
            },
            {
                "cod_phone": "+358",
                "iso_country": "FI",
                "description": "Finland"
            },
            {
                "cod_phone": "+33",
                "iso_country": "FR",
                "description": "France"
            },
            {
                "cod_phone": "+594",
                "iso_country": "GF",
                "description": "French Guiana"
            },
            {
                "cod_phone": "+689",
                "iso_country": "PF",
                "description": "French Polynesia"
            },
            {
                "cod_phone": "+241",
                "iso_country": "GA",
                "description": "Gabon"
            },
            {
                "cod_phone": "+220",
                "iso_country": "GM",
                "description": "Gambia"
            },
            {
                "cod_phone": "+995",
                "iso_country": "GE",
                "description": "Georgia"
            },
            {
                "cod_phone": "+49",
                "iso_country": "DE",
                "description": "Germany"
            },
            {
                "cod_phone": "+233",
                "iso_country": "GH",
                "description": "Ghana"
            },
            {
                "cod_phone": "+350",
                "iso_country": "GI",
                "description": "Gibraltar"
            },
            {
                "cod_phone": "+30",
                "iso_country": "GR",
                "description": "Greece"
            },
            {
                "cod_phone": "+299",
                "iso_country": "GL",
                "description": "Greenland"
            },
            {
                "cod_phone": "+472",
                "iso_country": "GD",
                "description": "Grenada"
            },
            {
                "cod_phone": "+590",
                "iso_country": "GP",
                "description": "Guadeloupe"
            },
            {
                "cod_phone": "+670",
                "iso_country": "GU",
                "description": "Guam"
            },
            {
                "cod_phone": "+502",
                "iso_country": "GT",
                "description": "Guatemala"
            },
            {
                "cod_phone": "+1437",
                "iso_country": "GG",
                "description": "Guernsey"
            },
            {
                "cod_phone": "+224",
                "iso_country": "GN",
                "description": "Guinea"
            },
            {
                "cod_phone": "+245",
                "iso_country": "GW",
                "description": "Guinea-Bissau"
            },
            {
                "cod_phone": "+592",
                "iso_country": "GY",
                "description": "Guyana"
            },
            {
                "cod_phone": "+509",
                "iso_country": "HT",
                "description": "Haiti"
            },
            {
                "cod_phone": "+504",
                "iso_country": "HN",
                "description": "Honduras"
            },
            {
                "cod_phone": "+852",
                "iso_country": "HK",
                "description": "Hong Kong"
            },
            {
                "cod_phone": "+36",
                "iso_country": "HU",
                "description": "Hungary"
            },
            {
                "cod_phone": "+354",
                "iso_country": "IS",
                "description": "Iceland"
            },
            {
                "cod_phone": "+91",
                "iso_country": "IN",
                "description": "India"
            },
            {
                "cod_phone": "+62",
                "iso_country": "ID",
                "description": "Indonesia"
            },
            {
                "cod_phone": "+98",
                "iso_country": "IR",
                "description": "Iran"
            },
            {
                "cod_phone": "+964",
                "iso_country": "IQ",
                "description": "Iraq"
            },
            {
                "cod_phone": "+353",
                "iso_country": "IE",
                "description": "Ireland"
            },
            {
                "cod_phone": "+1580",
                "iso_country": "IM",
                "description": "Isle of Man"
            },
            {
                "cod_phone": "+972",
                "iso_country": "IL",
                "description": "Israel"
            },
            {
                "cod_phone": "+39",
                "iso_country": "IT",
                "description": "Italy"
            },
            {
                "cod_phone": "+225",
                "iso_country": "CI",
                "description": "Ivory Coast"
            },
            {
                "cod_phone": "+875",
                "iso_country": "JM",
                "description": "Jamaica"
            },
            {
                "cod_phone": "+81",
                "iso_country": "JP",
                "description": "Japan"
            },
            {
                "cod_phone": "+1490",
                "iso_country": "JE",
                "description": "Jersey"
            },
            {
                "cod_phone": "+962",
                "iso_country": "JO",
                "description": "Jordan"
            },
            {
                "cod_phone": "+7",
                "iso_country": "KZ",
                "description": "Kazakhstan"
            },
            {
                "cod_phone": "+254",
                "iso_country": "KE",
                "description": "Kenya"
            },
            {
                "cod_phone": "+686",
                "iso_country": "KI",
                "description": "Kiribati"
            },
            {
                "cod_phone": "+965",
                "iso_country": "KW",
                "description": "Kuwait"
            },
            {
                "cod_phone": "+996",
                "iso_country": "KG",
                "description": "Kyrgyzstan"
            },
            {
                "cod_phone": "+856",
                "iso_country": "LA",
                "description": "Laos"
            },
            {
                "cod_phone": "+371",
                "iso_country": "LV",
                "description": "Latvia"
            },
            {
                "cod_phone": "+961",
                "iso_country": "LB",
                "description": "Lebanon"
            },
            {
                "cod_phone": "+266",
                "iso_country": "LS",
                "description": "Lesotho"
            },
            {
                "cod_phone": "+231",
                "iso_country": "LR",
                "description": "Liberia"
            },
            {
                "cod_phone": "+218",
                "iso_country": "LY",
                "description": "Libya"
            },
            {
                "cod_phone": "+423",
                "iso_country": "LI",
                "description": "Liechtenstein"
            },
            {
                "cod_phone": "+370",
                "iso_country": "LT",
                "description": "Lithuania"
            },
            {
                "cod_phone": "+352",
                "iso_country": "LU",
                "description": "Luxembourg"
            },
            {
                "cod_phone": "+853",
                "iso_country": "MO",
                "description": "Macao"
            },
            {
                "cod_phone": "+389",
                "iso_country": "MK",
                "description": "Macedonia"
            },
            {
                "cod_phone": "+261",
                "iso_country": "MG",
                "description": "Madagascar"
            },
            {
                "cod_phone": "+265",
                "iso_country": "MW",
                "description": "Malawi"
            },
            {
                "cod_phone": "+60",
                "iso_country": "MY",
                "description": "Malaysia"
            },
            {
                "cod_phone": "+960",
                "iso_country": "MV",
                "description": "Maldives"
            },
            {
                "cod_phone": "+223",
                "iso_country": "ML",
                "description": "Mali"
            },
            {
                "cod_phone": "+356",
                "iso_country": "MT",
                "description": "Malta"
            },
            {
                "cod_phone": "+692",
                "iso_country": "MH",
                "description": "Marshall Islands"
            },
            {
                "cod_phone": "+596",
                "iso_country": "MQ",
                "description": "Martinique"
            },
            {
                "cod_phone": "+222",
                "iso_country": "MR",
                "description": "Mauritania"
            },
            {
                "cod_phone": "+230",
                "iso_country": "MU",
                "description": "Mauritius"
            },
            {
                "cod_phone": "+269",
                "iso_country": "YT",
                "description": "Mayotte"
            },
            {
                "cod_phone": "+52",
                "iso_country": "MX",
                "description": "Mexico"
            },
            {
                "cod_phone": "+691",
                "iso_country": "FM",
                "description": "Micronesia"
            },
            {
                "cod_phone": "+373",
                "iso_country": "MD",
                "description": "Moldova"
            },
            {
                "cod_phone": "+377",
                "iso_country": "MC",
                "description": "Monaco"
            },
            {
                "cod_phone": "+976",
                "iso_country": "MN",
                "description": "Mongolia"
            },
            {
                "cod_phone": "+381",
                "iso_country": "ME",
                "description": "Montenegro"
            },
            {
                "cod_phone": "+663",
                "iso_country": "MS",
                "description": "Montserrat"
            },
            {
                "cod_phone": "+212",
                "iso_country": "MA",
                "description": "Morocco"
            },
            {
                "cod_phone": "+258",
                "iso_country": "MZ",
                "description": "Mozambique"
            },
            {
                "cod_phone": "+95",
                "iso_country": "MM",
                "description": "Myanmar"
            },
            {
                "cod_phone": "+264",
                "iso_country": "NA",
                "description": "Namibia"
            },
            {
                "cod_phone": "+674",
                "iso_country": "NR",
                "description": "Nauru"
            },
            {
                "cod_phone": "+977",
                "iso_country": "NP",
                "description": "Nepal"
            },
            {
                "cod_phone": "+31",
                "iso_country": "NL",
                "description": "Netherlands"
            },
            {
                "cod_phone": "+599",
                "iso_country": "AN",
                "description": "Netherlands Antilles"
            },
            {
                "cod_phone": "+687",
                "iso_country": "NC",
                "description": "New Caledonia"
            },
            {
                "cod_phone": "+64",
                "iso_country": "NZ",
                "description": "New Zealand"
            },
            {
                "cod_phone": "+505",
                "iso_country": "NI",
                "description": "Nicaragua"
            },
            {
                "cod_phone": "+227",
                "iso_country": "NE",
                "description": "Niger"
            },
            {
                "cod_phone": "+234",
                "iso_country": "NG",
                "description": "Nigeria"
            },
            {
                "cod_phone": "+683",
                "iso_country": "NU",
                "description": "Niue"
            },
            {
                "cod_phone": "+672",
                "iso_country": "NF",
                "description": "Norfolk Island"
            },
            {
                "cod_phone": "+850",
                "iso_country": "KP",
                "description": "North Korea"
            },
            {
                "cod_phone": "+669",
                "iso_country": "MP",
                "description": "Northern Mariana Islands"
            },
            {
                "cod_phone": "+47",
                "iso_country": "NO",
                "description": "Norway"
            },
            {
                "cod_phone": "+968",
                "iso_country": "OM",
                "description": "Oman"
            },
            {
                "cod_phone": "+92",
                "iso_country": "PK",
                "description": "Pakistan"
            },
            {
                "cod_phone": "+680",
                "iso_country": "PW",
                "description": "Palau"
            },
            {
                "cod_phone": "+970",
                "iso_country": "PS",
                "description": "Palestinian Territory"
            },
            {
                "cod_phone": "+507",
                "iso_country": "PA",
                "description": "Panama"
            },
            {
                "cod_phone": "+675",
                "iso_country": "PG",
                "description": "Papua New Guinea"
            },
            {
                "cod_phone": "+595",
                "iso_country": "PY",
                "description": "Paraguay"
            },
            {
                "cod_phone": "+51",
                "iso_country": "PE",
                "description": "Peru"
            },
            {
                "cod_phone": "+63",
                "iso_country": "PH",
                "description": "Philippines"
            },
            {
                "cod_phone": "+48",
                "iso_country": "PL",
                "description": "Poland"
            },
            {
                "cod_phone": "+351",
                "iso_country": "PT",
                "description": "Portugal"
            },
            {
                "cod_phone": "+1787",
                "iso_country": "PR",
                "description": "Puerto Rico"
            },
            {
                "cod_phone": "+1939",
                "iso_country": "PR",
                "description": "Puerto Rico"
            },
            {
                "cod_phone": "+974",
                "iso_country": "QA",
                "description": "Qatar"
            },
            {
                "cod_phone": "+242",
                "iso_country": "CG",
                "description": "Republic of the Congo"
            },
            {
                "cod_phone": "+262",
                "iso_country": "RE",
                "description": "Reunion"
            },
            {
                "cod_phone": "+40",
                "iso_country": "RO",
                "description": "Romania"
            },
            {
                "cod_phone": "+7",
                "iso_country": "RU",
                "description": "Russia"
            },
            {
                "cod_phone": "+250",
                "iso_country": "RW",
                "description": "Rwanda"
            },
            {
                "cod_phone": "+590",
                "iso_country": "BL",
                "description": "Saint BarthÃƒÂ©lemy"
            },
            {
                "cod_phone": "+290",
                "iso_country": "SH",
                "description": "Saint Helena"
            },
            {
                "cod_phone": "+868",
                "iso_country": "KN",
                "description": "Saint Kitts and Nevis"
            },
            {
                "cod_phone": "+757",
                "iso_country": "LC",
                "description": "Saint Lucia"
            },
            {
                "cod_phone": "+590",
                "iso_country": "MF",
                "description": "Saint Martin"
            },
            {
                "cod_phone": "+508",
                "iso_country": "PM",
                "description": "Saint Pierre and Miquelon"
            },
            {
                "cod_phone": "+783",
                "iso_country": "VC",
                "description": "Saint Vincent and the Grenadines"
            },
            {
                "cod_phone": "+685",
                "iso_country": "WS",
                "description": "Samoa"
            },
            {
                "cod_phone": "+378",
                "iso_country": "SM",
                "description": "San Marino"
            },
            {
                "cod_phone": "+239",
                "iso_country": "ST",
                "description": "Sao Tome and Principe"
            },
            {
                "cod_phone": "+966",
                "iso_country": "SA",
                "description": "Saudi Arabia"
            },
            {
                "cod_phone": "+221",
                "iso_country": "SN",
                "description": "Senegal"
            },
            {
                "cod_phone": "+381",
                "iso_country": "RS",
                "description": "Serbia"
            },
            {
                "cod_phone": "+381",
                "iso_country": "CS",
                "description": "Serbia and Montenegro"
            },
            {
                "cod_phone": "+248",
                "iso_country": "SC",
                "description": "Seychelles"
            },
            {
                "cod_phone": "+232",
                "iso_country": "SL",
                "description": "Sierra Leone"
            },
            {
                "cod_phone": "+65",
                "iso_country": "SG",
                "description": "Singapore"
            },
            {
                "cod_phone": "+421",
                "iso_country": "SK",
                "description": "Slovakia"
            },
            {
                "cod_phone": "+386",
                "iso_country": "SI",
                "description": "Slovenia"
            },
            {
                "cod_phone": "+677",
                "iso_country": "SB",
                "description": "Solomon Islands"
            },
            {
                "cod_phone": "+252",
                "iso_country": "SO",
                "description": "Somalia"
            },
            {
                "cod_phone": "+27",
                "iso_country": "ZA",
                "description": "South Africa"
            },
            {
                "cod_phone": "+82",
                "iso_country": "KR",
                "description": "South Korea"
            },
            {
                "cod_phone": "+34",
                "iso_country": "ES",
                "description": "Spain"
            },
            {
                "cod_phone": "+94",
                "iso_country": "LK",
                "description": "Sri Lanka"
            },
            {
                "cod_phone": "+249",
                "iso_country": "SD",
                "description": "Sudan"
            },
            {
                "cod_phone": "+597",
                "iso_country": "SR",
                "description": "Suriname"
            },
            {
                "cod_phone": "+47",
                "iso_country": "SJ",
                "description": "Svalbard and Jan Mayen"
            },
            {
                "cod_phone": "+268",
                "iso_country": "SZ",
                "description": "Swaziland"
            },
            {
                "cod_phone": "+46",
                "iso_country": "SE",
                "description": "Sweden"
            },
            {
                "cod_phone": "+41",
                "iso_country": "CH",
                "description": "Switzerland"
            },
            {
                "cod_phone": "+963",
                "iso_country": "SY",
                "description": "Syria"
            },
            {
                "cod_phone": "+886",
                "iso_country": "TW",
                "description": "Taiwan"
            },
            {
                "cod_phone": "+992",
                "iso_country": "TJ",
                "description": "Tajikistan"
            },
            {
                "cod_phone": "+255",
                "iso_country": "TZ",
                "description": "Tanzania"
            },
            {
                "cod_phone": "+66",
                "iso_country": "TH",
                "description": "Thailand"
            },
            {
                "cod_phone": "+228",
                "iso_country": "TG",
                "description": "Togo"
            },
            {
                "cod_phone": "+690",
                "iso_country": "TK",
                "description": "Tokelau"
            },
            {
                "cod_phone": "+676",
                "iso_country": "TO",
                "description": "Tonga"
            },
            {
                "cod_phone": "+867",
                "iso_country": "TT",
                "description": "Trinidad and Tobago"
            },
            {
                "cod_phone": "+216",
                "iso_country": "TN",
                "description": "Tunisia"
            },
            {
                "cod_phone": "+90",
                "iso_country": "TR",
                "description": "Turkey"
            },
            {
                "cod_phone": "+993",
                "iso_country": "TM",
                "description": "Turkmenistan"
            },
            {
                "cod_phone": "+648",
                "iso_country": "TC",
                "description": "Turks and Caicos Islands"
            },
            {
                "cod_phone": "+688",
                "iso_country": "TV",
                "description": "Tuvalu"
            },
            {
                "cod_phone": "+339",
                "iso_country": "VI",
                "description": "U.S. Virgin Islands"
            },
            {
                "cod_phone": "+256",
                "iso_country": "UG",
                "description": "Uganda"
            },
            {
                "cod_phone": "+380",
                "iso_country": "UA",
                "description": "Ukraine"
            },
            {
                "cod_phone": "+971",
                "iso_country": "AE",
                "description": "United Arab Emirates"
            },
            {
                "cod_phone": "+44",
                "iso_country": "GB",
                "description": "United Kingdom"
            },
            {
                "cod_phone": "+1",
                "iso_country": "US",
                "description": "United States"
            },
            {
                "cod_phone": "+1",
                "iso_country": "UC",
                "description": "United States/Cobro Revertido"
            },
            {
                "cod_phone": "+598",
                "iso_country": "UY",
                "description": "Uruguay"
            },
            {
                "cod_phone": "+998",
                "iso_country": "UZ",
                "description": "Uzbekistan"
            },
            {
                "cod_phone": "+678",
                "iso_country": "VU",
                "description": "Vanuatu"
            },
            {
                "cod_phone": "+379",
                "iso_country": "VA",
                "description": "Vatican"
            },
            {
                "cod_phone": "+58",
                "iso_country": "VE",
                "description": "Venezuela"
            },
            {
                "cod_phone": "+84",
                "iso_country": "VN",
                "description": "Vietnam"
            },
            {
                "cod_phone": "+681",
                "iso_country": "WF",
                "description": "Wallis and Futuna"
            },
            {
                "cod_phone": "+212",
                "iso_country": "EH",
                "description": "Western Sahara"
            },
            {
                "cod_phone": "+967",
                "iso_country": "YE",
                "description": "Yemen"
            },
            {
                "cod_phone": "+260",
                "iso_country": "ZM",
                "description": "Zambia"
            },
            {
                "cod_phone": "+263",
                "iso_country": "ZW",
                "description": "Zimbabwe"
            }
        ];
        return codigos;
    }

}