import { useContext, useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import Context from '@/context/context';
import { useKeys } from '@/hooks';
import locales_data from '@/locales.json';
import { useRouter } from 'next/router';

export default function ContractForm() {
  const router = useRouter();
  const { locales, locale, asPath } = router;

  const { setFile, setFileName, setFileType, setFileUri } = useContext(Context);
  const { openAIapiKey } = useKeys();

  const [date, setDate] = useState();
  const [city, setCity] = useState();
  const [state, setState] = useState();
  const [country, setCountry] = useState();
  const [personName1, setPersonName1] = useState();
  const [companyName1, setCompanyName1] = useState();
  const [companyLocation1, setCompanyLocation1] = useState();
  const [personName2, setPersonName2] = useState();
  const [companyName2, setCompanyName2] = useState();
  const [companyLocation2, setCompanyLocation2] = useState();
  const [psName, setPsName] = useState();
  const [psTitle, setPsTitle] = useState();
  const [psDescription, setPsDescription] = useState();
  const [psQuantity, setPsQuantity] = useState();
  const [price, setPrice] = useState();
  const [timeframes, setTimeframes] = useState();
  const [paymentType, setPaymentType] = useState();

  const [sellOffer, setSellOffer] = useState(true);
  const [buyOffer, setBuyOffer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Contract of Sale');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleSellOfferChange = () => {
    setSellOffer(true);
    setBuyOffer(false);
  };

  const handleBuyOfferChange = () => {
    setSellOffer(false);
    setBuyOffer(true);
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handlePersonName1Change = (e) => {
    setPersonName1(e.target.value);
  };

  const handleCompanyName1Change = (e) => {
    setCompanyName1(e.target.value);
  };

  const handleCompanyLocation1Change = (e) => {
    setCompanyLocation1(e.target.value);
  };

  const handlePersonName2Change = (e) => {
    setPersonName2(e.target.value);
  };

  const handleCompanyName2Change = (e) => {
    setCompanyName2(e.target.value);
  };

  const handleCompanyLocation2Change = (e) => {
    setCompanyLocation2(e.target.value);
  };

  const handlePsNameChange = (e) => {
    setPsName(e.target.value);
  };

  const handlePsTitleChange = (e) => {
    setPsTitle(e.target.value);
  };

  const handlePsDescriptionChange = (e) => {
    setPsDescription(e.target.value);
  };

  const handlePsQuantityChange = (e) => {
    setPsQuantity(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleTimeframesChange = (e) => {
    setTimeframes(e.target.value);
  };

  const handlePaymentTypeChange = (e) => {
    setPaymentType(e.target.value);
  };

  const handleGenerateClick = async () => {
    fetch('/api/generatePDF', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OpenAI-Key': openAIapiKey,
      },
      body: JSON.stringify({
        date,
        city,
        state,
        country,
        personName1,
        companyName1,
        companyLocation1,
        personName2,
        companyName2,
        companyLocation2,
        psName,
        psTitle,
        psDescription,
        psQuantity,
        price,
        timeframes,
        paymentType,
        sellOffer,
        buyOffer,
        selectedCategory,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const fileName = data.fileName;
        const file = data.file;
        if (file && fileName) {
          const fileType = 'pdf';
          const buffer = Buffer.from(file.data);
          const base64 = buffer.toString('base64');
          setFileUri(`data:application/pdf;base64, ${base64}`);
          setFile(file);
          setFileName(fileName);
          setFileType(fileType);
        }
      });
  };

  return (
    <div className="p-5">
      <form>
        <div className="space-y-5">
          <div className="border-b border-white/10 pb-5">
            <h2 className="text-base font-semibold leading-7 text-white">
              {locales_data[locale]['create_new_contract']}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              {locales_data[locale]['create_tooltip']}
            </p>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="category"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['type_of_contract']}
                </label>
                <div className="mt-2">
                  <select
                    id="category"
                    name="category"
                    autoComplete="category-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option>{locales_data[locale]['contract_of_sale']}</option>
                    <option>
                      {locales_data[locale]['employment_contract']}
                    </option>
                    <option>
                      {locales_data[locale]['non-disclosure_agreement']}
                    </option>
                    <option>
                      {locales_data[locale]['real_estate_contracts']}
                    </option>
                    <option>
                      {locales_data[locale]['executory_contract']}
                    </option>
                    <option>{locales_data[locale]['deed_of_trust']}</option>
                    <option>{locales_data[locale]['mutual_agreements']}</option>
                    <option>
                      {locales_data[locale]['time_and_materials_contracts']}
                    </option>
                    <option>{locales_data[locale]['prenuptials']}</option>
                    <option>
                      {locales_data[locale]['music_business_contracts']}
                    </option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2 sm:col-start-1">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['city']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={city}
                    onChange={handleCityChange}
                    autoComplete="address-level2"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['state']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={state}
                    onChange={handleStateChange}
                    autoComplete="address-level1"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['country']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={country}
                    onChange={handleCountryChange}
                    autoComplete="country"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="sm:col-span-6">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['date']}
                </label>
                <div className="mt-2">
                  <Datepicker
                    asSingle
                    useRange={false}
                    value={date}
                    onChange={handleDateChange}
                    inputClassName="w-full rounded-md focus:ring-0 font-normal bg-white/5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="personName1"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['your_name']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="personName1"
                    id="personName1"
                    value={personName1}
                    onChange={handlePersonName1Change}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="companyName1"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]["your_company's_name"]}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="companyName1"
                    id="companyName1"
                    value={companyName1}
                    onChange={handleCompanyName1Change}
                    autoComplete="organization"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="companyLocation1"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]["your_company's_location"]}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="companyLocation1"
                    id="companyLocation1"
                    value={companyLocation1}
                    onChange={handleCompanyLocation1Change}
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="personName2"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]["involved_party's_person's_name"]}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="personName2"
                    id="personName2"
                    value={personName2}
                    onChange={handlePersonName2Change}
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="companyName2"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]["involved_party's_company's_name"]}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="companyName2"
                    id="companyName2"
                    value={companyName2}
                    onChange={handleCompanyName2Change}
                    autoComplete="organization"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="companyLocation2"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]["involved_party's_company's_location"]}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="companyLocation2"
                    id="companyLocation2"
                    value={companyLocation2}
                    onChange={handleCompanyLocation2Change}
                    autoComplete="street-address"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex items-center gap-x-3">
                  <input
                    id="sell-offer"
                    name="offer-mode"
                    type="radio"
                    className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                    checked={sellOffer}
                    onChange={handleSellOfferChange}
                  />
                  <label
                    htmlFor="sell-offer"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    {locales_data[locale]['what_will_your_company_sell']}
                  </label>
                </div>
                <div className="flex items-center gap-x-3">
                  <input
                    id="buy-offer"
                    name="offer-mode"
                    type="radio"
                    className="h-4 w-4 border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-600 focus:ring-offset-gray-900"
                    checked={buyOffer}
                    onChange={handleBuyOfferChange}
                  />
                  <label
                    htmlFor="buy-offer"
                    className="block text-sm font-medium leading-6 text-white"
                  >
                    {locales_data[locale]['what_will_your_company_buy']}
                  </label>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="psName"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {sellOffer
                    ? locales_data[locale]['seller_name']
                    : locales_data[locale]['provider_name']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="psName"
                    id="psName"
                    value={psName}
                    onChange={handlePsNameChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="psTitle"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {sellOffer
                    ? locales_data[locale]['provider_name']
                    : locales_data[locale]['service_name']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="psTitle"
                    id="psTitle"
                    value={psTitle}
                    onChange={handlePsTitleChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="psDescription"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {sellOffer
                    ? locales_data[locale]['product']
                    : locales_data[locale]['service']}{' '}
                  {locales_data[locale]['description_and_details']}
                </label>
                <div className="mt-2">
                  <textarea
                    name="psDescription"
                    id="psDescription"
                    rows={3}
                    value={psDescription}
                    onChange={handlePsDescriptionChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  ></textarea>
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="psQuantity"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {sellOffer
                    ? locales_data[locale]['product']
                    : locales_data[locale]['service']}{' '}
                  {locales_data[locale]['quantity']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="psQuantity"
                    id="psQuantity"
                    value={psQuantity}
                    onChange={handlePsQuantityChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['price']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="price"
                    id="price"
                    value={price}
                    onChange={handlePriceChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="timeframes"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['timeframes']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="timeframes"
                    id="timeframes"
                    value={timeframes}
                    onChange={handleTimeframesChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label
                  htmlFor="paymentType"
                  className="block text-sm font-medium leading-6 text-white"
                >
                  {locales_data[locale]['type_of_payment']}
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="paymentType"
                    id="paymentType"
                    value={paymentType}
                    onChange={handlePaymentTypeChange}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={handleGenerateClick}
                  >
                    {locales_data[locale]['submit']}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
