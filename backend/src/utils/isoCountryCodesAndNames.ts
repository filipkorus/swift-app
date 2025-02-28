const isoCountryCodes = new Set([
	"AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
	"BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO",
	"BN", "BG", "BF", "BI", "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM",
	"CD", "CG", "CK", "CR", "HR", "CU", "CW", "CY", "CZ", "CI", "DK", "DJ", "DM", "DO", "EC", "EG", "SV",
	"GQ", "ER", "EE", "SZ", "ET", "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF", "GA", "GM", "GE", "DE",
	"GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY", "HT", "HM", "VA", "HN", "HK",
	"HU", "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT", "JM", "JP", "JE", "JO", "KZ", "KE", "KI",
	"KP", "KR", "KW", "KG", "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU", "MO", "MG", "MW", "MY",
	"MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ",
	"MM", "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO", "OM", "PK",
	"PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA", "RO", "RU", "RW", "RE", "BL",
	"SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK",
	"SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY", "TW", "TJ", "TZ",
	"TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV", "UG", "UA", "AE", "GB", "US", "UM",
	"UY", "UZ", "VU", "VE", "VN", "VG", "VI", "WF", "EH", "YE", "ZM", "ZW"
]);

const countryNames = new Set([
	"AFGHANISTAN", "ALAND ISLANDS", "ALBANIA", "ALGERIA", "AMERICAN SAMOA", "ANDORRA", "ANGOLA", "ANGUILLA", "ANTARCTICA", "ANTIGUA AND BARBUDA", "ARGENTINA", "ARMENIA", "ARUBA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN",
	"BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BERMUDA", "BHUTAN", "BOLIVIA", "BONAIRE, SINT EUSTATIUS AND SABA", "BOSNIA AND HERZEGOVINA", "BOTSWANA", "BOUVET ISLAND", "BRAZIL", "BRITISH INDIAN OCEAN TERRITORY",
	"BRUNEI", "BULGARIA", "BURKINA FASO", "BURUNDI", "CAPE VERDE", "CAMBODIA", "CAMEROON", "CANADA", "CAYMAN ISLANDS", "CENTRAL AFRICAN REPUBLIC", "CHAD", "CHILE", "CHINA", "CHRISTMAS ISLAND", "COCOS (KEELING) ISLANDS", "COLOMBIA", "COMOROS",
	"DEMOCRATIC REPUBLIC OF THE CONGO", "REPUBLIC OF THE CONGO", "COOK ISLANDS", "COSTA RICA", "CROATIA", "CUBA", "CURACAO", "CYPRUS", "CZECH REPUBLIC", "COTE D'IVOIRE", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "ECUADOR", "EGYPT", "EL SALVADOR",
	"EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ESWATINI", "ETHIOPIA", "FALKLAND ISLANDS", "FAROE ISLANDS", "FIJI", "FINLAND", "FRANCE", "FRENCH GUIANA", "FRENCH POLYNESIA", "FRENCH SOUTHERN AND ANTARCTIC LANDS", "GABON", "GAMBIA", "GEORGIA", "GERMANY",
	"GHANA", "GIBRALTAR", "GREECE", "GREENLAND", "GRENADA", "GUADELOUPE", "GUAM", "GUATEMALA", "GUERNSEY", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HEARD ISLAND AND MCDONALD ISLANDS", "HOLY SEE", "HONDURAS", "HONG KONG",
	"HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", "IRELAND", "ISLE OF MAN", "ISRAEL", "ITALY", "JAMAICA", "JAPAN", "JERSEY", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "NORTH KOREA", "SOUTH KOREA", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACAU", "MADAGASCAR", "MALAWI", "MALAYSIA",
	"MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MARTINIQUE", "MAURITANIA", "MAURITIUS", "MAYOTTE", "MEXICO", "MICRONESIA", "MOLDOVA", "MONACO", "MONGOLIA", "MONTENEGRO", "MONTSERRAT", "MOROCCO", "MOZAMBIQUE",
	"MYANMAR", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NEW CALEDONIA", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NIUE", "NORFOLK ISLAND", "NORTH MACEDONIA", "NORTHERN MARIANA ISLANDS", "NORWAY", "OMAN", "PAKISTAN",
	"PALAU", "PALESTINIAN TERRITORIES", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "PITCAIRN ISLANDS", "POLAND", "PORTUGAL", "PUERTO RICO", "QATAR", "ROMANIA", "RUSSIA", "RWANDA", "REUNION", "SAINT BARTHELEMY",
	"SAINT HELENA", "SAINT KITTS AND NEVIS", "SAINT LUCIA", "SAINT MARTIN", "SAINT PIERRE AND MIQUELON", "SAINT VINCENT AND THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME AND PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SINT MAARTEN", "SLOVAKIA",
	"SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SVALBARD AND JAN MAYEN", "SWEDEN", "SWITZERLAND", "SYRIA", "TAIWAN", "TAJIKISTAN", "TANZANIA",
	"THAILAND", "TIMOR-LESTE", "TOGO", "TOKELAU", "TONGA", "TRINIDAD AND TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TURKS AND CAICOS ISLANDS", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "UNITED STATES MINOR OUTLYING ISLANDS",
	"URUGUAY", "UZBEKISTAN", "VANUATU", "VENEZUELA", "VIETNAM", "BRITISH VIRGIN ISLANDS", "U.S. VIRGIN ISLANDS", "WALLIS AND FUTUNA", "WESTERN SAHARA", "YEMEN", "ZAMBIA", "ZIMBABWE"
]);

const createISOCountryCodesAndNamesObj = () => {
	const isoCodesArray = Array.from(isoCountryCodes);
	const countryNamesArray = Array.from(countryNames);

	const countryCodeMapping: Record<string, string> = {};

	for (let i = 0; i < isoCodesArray.length; i++) {
		countryCodeMapping[isoCodesArray[i]] = countryNamesArray[i];
	}

	return countryCodeMapping;
};

const createISOCountryCodesAndNamesArray = () => {
	return Object.keys(isoCountryCodesAndNamesObj).map((iso) => ({
		countryName: isoCountryCodesAndNamesObj[iso],
		countryISO2: iso
	}));
};

const isoCountryCodesAndNamesObj = createISOCountryCodesAndNamesObj();
const isoCountryCodesAndNamesArray = createISOCountryCodesAndNamesArray();

/**
 * Checks if a country code matches a country name.
 * @param countryISO2 The country code to check.
 * @param countryName The country name to check.
 */
const checkIfCountryCodeMatchesName = (
	countryISO2: string,
	countryName: string
) => isoCountryCodesAndNamesObj[countryISO2] === countryName;

export {
	isoCountryCodes,
	countryNames,
	isoCountryCodesAndNamesArray,
	isoCountryCodesAndNamesObj,
	checkIfCountryCodeMatchesName
};
