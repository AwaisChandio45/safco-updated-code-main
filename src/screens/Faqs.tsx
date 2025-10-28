import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { AppStatusBar, Header, HeaderwithoutDialoge, TextView } from '../components';
import { Colors, GlobalStyles } from '../theme';
import { Picker } from '@react-native-picker/picker';
const Faqs = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [language, setLanguage] = useState('en'); // State for selected language

  // Complete FAQ object in multiple languages
  const faqs = {
    en: [
      {
        section: 'General Questions',
        items: [
          {
            question: "What is SAFCO’s primary mission?",
            answer:
              "SAFCO aims to provide financial and business solutions to unbanked, low-income communities in rural and urban areas, fostering economic growth through sustainable and ethical practices.",
          },
          {
            question: "What are the key requirements to apply for a loan?",
            answer:
              "Key requirements include:\n• A valid CNIC.\n• Legal business or employment.\n• Minimum experience in business/employment (varies by product).\n• Residence in SAFCO’s operational area for at least two years.",
          },
          {
            question: "What is the age limit for borrowers?",
            answer:
              "The age limit for borrowers is generally 18-62 years, depending on the loan product.",
          },
          {
            question: "What is the process for approving loans?",
            answer:
              "Loan approval involves:\n• Submission of required documents.\n• Verification of cash flow and credit history.\n• Approval from SAFCO’s designated authority based on loan limits.",
          },
        ],
      },
      {
        section: 'Loan Products',
        items: [
          {
            question: "What loan products are available?",
            answer:
              "SAFCO offers various loan products, including:\n• Enterprise Development Loan (Rs. 30,000 - Rs. 300,000)\n• Livestock Development Loan (Rs. 30,000 - Rs. 300,000)\n• Agriculture Development Loan (Rs. 30,000 - Rs. 300,000)\n• SME Loan (Rs. 301,000 - Rs. 1,000,000)\n• Personal Loan (Rs. 50,000 - Rs. 300,000)\n• Eid-ul-Azha Loan (Rs. 50,000 - Rs. 300,000)\n• School Improvement Loan (Rs. 25,000 - Rs. 500,000)\n• Solar Loan (Rs. 6,000 - Rs. 1,500,000)\n• Auto Finance Loan (Rs. 20,000 - Rs. 500,000)",
          },
          {
            question: "What is the loan tenure for different products?",
            answer:
              "Loan tenure varies as follows:\n• Enterprise Development Loan: 12-24 months.\n• Livestock Development Loan: 6-24 months.\n• Agriculture Development Loan: 6 months.\n• Personal Loan: 12-24 months.\n• School Improvement Loan: 12-24 months.\n• SME Loan: 12-36 months.\n• Solar Loan: 6-60 months.\n• Auto Finance Loan: 12-24 months.",
          },
          {
            question: "What are the financial income charges for loan products?",
            answer:
              "Charges are calculated on a flat basis per year:\n• Agriculture Development Loan: 30%\n• Livestock Development Loan: 28%\n• Personal Loan: 32%\n• SME Loan: 30%\n• School Improvement Loan: 22%\n• Solar Loan: 28%\n• Auto Finance Loan: 30%",
          },
        ],
      },
      {
        section: 'Eligibility and Documentation',
        items: [
          {
            question: "What documents are required for a loan application?",
            answer:
              "Common requirements include:\n• Original CNIC snapshot.\n• Recent online snapshot.\n• Cash flow analysis.\n• Post-dated cheques.\n• Proof of residence/employment.\n• Additional documents vary by product.",
          },
          {
            question: "Are there specific requirements for female borrowers?",
            answer:
              "Yes, female borrowers must provide:\n• Male guarantor’s CNIC (e.g., husband, father, or brother).\n• Signed declarations in compliance with SAFCO policies.",
          },
          {
            question: "Are there any prohibited professions or businesses?",
            answer:
              "Yes, SAFCO does not provide loans to individuals in certain professions (e.g., lawyers, law enforcement officials) or businesses involved in hazardous chemicals, gambling, or environmental harm.",
          },
        ],
      },
      {
        section: 'Loan Processing and Policies',
        items: [
          {
            question: "What is the grace period for repayment?",
            answer:
              "A grace period of up to six months is allowed for bullet loans (based on cash flow). Monthly loans may have a shorter grace period of up to 45 days.",
          },
          {
            question: "Can borrowers close their loans early?",
            answer:
              "Yes, SAFCO allows early loan closure without penalties. Borrowers pay the principal amount and applicable financial income charges.",
          },
          {
            question: "What is SAFCO’s policy on overdue loans?",
            answer:
              "Overdue loans may result in ineligibility for further loans for three years post-clearance. Compliance with SAFCO’s CIB Disbursement Policy is mandatory.",
          },
        ],
      },
      {
        section: 'Special Features',
        items: [
          {
            question: "Does SAFCO offer support for specific sectors?",
            answer:
              "Yes, SAFCO supports:\n• Entrepreneurs and small businesses.\n• Livestock and agriculture sectors.\n• Renewable energy through solar loans.\n• Education through school improvement loans.",
          },
          {
            question: "Are there additional services for clients?",
            answer:
              "SAFCO provides financial education, borrower training, and AML/CFT compliance to ensure ethical and informed borrowing practices.",
          },
        ],
      },
      {
        section: 'Contact and Support',
        items: [
          {
            question: "Where can borrowers or officers seek assistance?",
            answer:
              "Borrowers can reach out to their respective branch offices or contact SAFCO’s helpline for queries and support.",
          },
        ],
      },
    ],
    ur: [
      {
        section: 'عمومی سوالات',
        items: [
          {
            question: "سافکو کا بنیادی مشن کیا ہے؟",
            answer:
              "سافکو کا مقصد غریب، کم آمدنی والے کمیونٹیز کو مالی اور کاروباری حل فراہم کرنا ہے، تاکہ پائیدار اور اخلاقی طریقوں سے معاشی ترقی کو فروغ دیا جا سکے۔",
          },
          {
            question: "قرض کے لیے درخواست دینے کے لیے اہم تقاضے کیا ہیں؟",
            answer:
              "اہم تقاضے درج ذیل ہیں:\n• ایک درست شناختی کارڈ (CNIC)\n• قانونی کاروبار یا ملازمت\n• کاروبار/ملازمت کا کم از کم تجربہ (پروڈکٹ کے مطابق مختلف ہو سکتا ہے)\n• سافکو کے آپریشنل علاقے میں کم از کم دو سال کی رہائش",
          },
          {
            question: "قرض لینے والوں کی عمر کی حد کیا ہے؟",
            answer:
              "قرض لینے والوں کی عمر کی حد عموماً 18 سے 62 سال تک ہوتی ہے، جو قرض کے پروڈکٹ پر منحصر ہے۔",
          },
          {
            question: "قرض کی منظوری کا عمل کیا ہے؟",
            answer:
              "قرض کی منظوری میں شامل ہیں:\n• مطلوبہ دستاویزات کی جمع کروائی\n• کیش فلو اور کریڈٹ ہسٹری کی تصدیق\n• قرض کی حدوں کی بنیاد پر سافکو کی مقرر کردہ اتھارٹی کی منظوری",
          },
        ],
      },
      {
        section: 'قرض کے پروڈکٹس',
        items: [
          {
            question: "کون سے قرض پروڈکٹس دستیاب ہیں؟",
            answer:
              "سافکو مختلف قرض پروڈکٹس فراہم کرتا ہے، جن میں شامل ہیں:\n• انٹرپرائز ڈویلپمنٹ قرض (Rs. 30,000 - Rs. 300,000)\n• لائیوسٹاک ڈویلپمنٹ قرض (Rs. 30,000 - Rs. 300,000)\n• زرعی ڈویلپمنٹ قرض (Rs. 30,000 - Rs. 300,000)\n• ایس ایم ای قرض (Rs. 301,000 - Rs. 1,000,000)\n• ذاتی قرض (Rs. 50,000 - Rs. 300,000)\n• عید الاضحیٰ قرض (Rs. 50,000 - Rs. 300,000)\n• اسکول کی بہتری کا قرض (Rs. 25,000 - Rs. 500,000)\n• سولر قرض (Rs. 6,000 - Rs. 1,500,000)\n• آٹو فنانس قرض (Rs. 20,000 - Rs. 500,000)",
          },
          {
            question: "مختلف پروڈکٹس کے لیے قرض کی مدت کیا ہے؟",
            answer:
              "قرض کی مدت مختلف ہوتی ہے، جیسے:\n• انٹرپرائز ڈویلپمنٹ قرض: 12-24 ماہ\n• لائیوسٹاک ڈویلپمنٹ قرض: 6-24 ماہ\n• زرعی ڈویلپمنٹ قرض: 6 ماہ\n• ذاتی قرض: 12-24 ماہ\n• اسکول کی بہتری کا قرض: 12-24 ماہ\n• ایس ایم ای قرض: 12-36 ماہ\n• سولر قرض: 6-60 ماہ\n• آٹو فنانس قرض: 12-24 ماہ",
          },
          {
            question: "قرض پروڈکٹس کے لیے مالی چارجز کیا ہیں؟",
            answer:
              "چارجز سالانہ فلیٹ بیسس پر حساب کیے جاتے ہیں:\n• زرعی ڈویلپمنٹ قرض: 30%\n• لائیوسٹاک ڈویلپمنٹ قرض: 28%\n• ذاتی قرض: 32%\n• ایس ایم ای قرض: 30%\n• اسکول کی بہتری کا قرض: 22%\n• سولر قرض: 28%\n• آٹو فنانس قرض: 30%",
          },
        ],
      },
      {
        section: 'اہلیت اور دستاویزات',
        items: [
          {
            question: "قرض کی درخواست کے لیے کون سے دستاویزات درکار ہیں؟",
            answer:
              "عام ضروریات میں شامل ہیں:\n• اصل شناختی کارڈ کی عکس\n• حالیہ آن لائن عکس\n• کیش فلو کا تجزیہ\n• پوسٹ ڈیٹڈ چیک\n• رہائش/ملازمت کا ثبوت\n• اضافی دستاویزات پروڈکٹ کے حساب سے مختلف ہو سکتی ہیں۔",
          },
          {
            question: "خواتین قرض لینے والوں کے لیے مخصوص تقاضے ہیں؟",
            answer:
              "جی ہاں، خواتین قرض لینے والوں کو درج ذیل فراہم کرنا ضروری ہے:\n• مرد ضامن کا شناختی کارڈ (مثلاً شوہر، والد یا بھائی)\n• سافکو کی پالیسیوں کے مطابق دستخط شدہ اعلانات",
          },
          {
            question: "کیا کوئی مخصوص کاروبار یا پیشے ممنوع ہیں؟",
            answer:
              "جی ہاں، سافکو کچھ پیشوں (مثلاً وکیل، قانون نافذ کرنے والے افسران) یا ایسے کاروباروں کو قرض فراہم نہیں کرتا جو خطرناک کیمیکلز، جوا یا ماحولیاتی نقصان میں ملوث ہوں۔",
          },
        ],
      },
      {
        section: 'قرض پروسیسنگ اور پالیسیاں',
        items: [
          {
            question: "قرض کی واپسی کے لیے گراسی پیریڈ کیا ہے؟",
            answer:
              "بلٹ قرضوں کے لیے چھ ماہ تک کا گراسی پیریڈ دیا جاتا ہے (کیش فلو کی بنیاد پر)۔ ماہانہ قرضوں کے لیے 45 دن تک کا گراسی پیریڈ ہو سکتا ہے۔",
          },
          {
            question: "کیا قرض لینے والے اپنے قرض جلدی ادا کر سکتے ہیں؟",
            answer:
              "جی ہاں، سافکو بغیر کسی جرمانے کے قرض کی جلدی واپسی کی اجازت دیتا ہے۔ قرض لینے والے اصل رقم اور مالی چارجز ادا کرتے ہیں۔",
          },
          {
            question: "سافکو کی پالیسی پر قرض کی ادائیگی میں تاخیر کیا ہے؟",
            answer:
              "جو قرض وقت پر ادا نہیں کیے جاتے، ان پر تین سال تک مزید قرض لینے کے لیے نااہلیت ہو سکتی ہے۔ سافکو کی CIB ڈسبرسمنٹ پالیسی کی پابندی ضروری ہے۔",
          },
        ],
      },
      {
        section: 'خصوصی خصوصیات',
        items: [
          {
            question: "کیا سافکو مخصوص شعبوں کے لیے مدد فراہم کرتا ہے؟",
            answer:
              "جی ہاں، سافکو درج ذیل شعبوں کی مدد کرتا ہے:\n• کاروباری افراد اور چھوٹے کاروبار\n• لائیوسٹاک اور زرعی شعبے\n• سولر قرضوں کے ذریعے قابل تجدید توانائی\n• اسکول کی بہتری کے قرضوں کے ذریعے تعلیم",
          },
          {
            question: "کیا گاہکوں کے لیے اضافی خدمات دستیاب ہیں؟",
            answer:
              "سافکو مالی تعلیم، قرض لینے والوں کی تربیت اور AML/CFT کے مطابق خدمات فراہم کرتا ہے تاکہ اخلاقی اور آگاہ قرض لینے کے طریقے اپنائے جا سکیں۔",
          },
        ],
      },
      {
        section: 'رابطہ اور مدد',
        items: [
          {
            question: "قرض لینے والے یا افسر کہاں مدد حاصل کر سکتے ہیں؟",
            answer:
              "قرض لینے والے اپنے متعلقہ برانچ آفسز سے رابطہ کر سکتے ہیں یا سافکو کی ہیلپ لائن سے مدد حاصل کر سکتے ہیں۔",
          },
        ],
      },
    ],
    sd: [
      {
        section: 'عام سوالات',
        items: [
          {
            question: "سافڪو جو مکيه مقصد ڇا آهي؟",
            answer:
              "سافڪو جو مقصد گارنٽي ٿيل ۽ شهري علائقن ۾ غريب ۽ غير بينڪ ٿيل ڪميونٽيز کي مالي ۽ ڪاروباري حل مهيا ڪرڻ آهي، جيڪو پائيدار ۽ اخلاقي طريقن سان اقتصادي ترقيءَ ۾ مدد ڪري ٿو.",
          },
          {
            question: "قرض لاءِ درخواست ڏيڻ جي بنيادي گهرجون ڇا آهن؟",
            answer:
              "بنيادي گهرجون هيٺ ڏنل آهن:\n• هڪ صحيح CNIC.\n• قانوني ڪاروبار يا روزگار.\n• ڪاروبار/روزگار ۾ گهٽ ۾ گهٽ تجربو (پروڊڪٽ جي مطابق مختلف).\n• سافڪو جي آپريشنل علائقي ۾ گهٽ ۾ گهٽ ٻه سال رهائش.",
          },
          {
            question: "قرض وٺڻ لاءِ عمر جي حد ڇا آهي؟",
            answer:
              "قرض وٺڻ جي عمر جي حد عام طور تي 18 کان 62 سال آهي، جيڪو قرض جي پراڊڪٽ تي منحصر آهي.",
          },
          {
            question: "قرضن جي منظوري جو عمل ڇا آهي؟",
            answer:
              "قرضن جي منظوري ۾ شامل آهي:\n• ضروري دستاويز جمع ڪرڻ.\n• ڪيش فلو ۽ ڪريڊٽ هسٽري جي تصديق.\n• قرض جي حدن جي بنياد تي سافڪو جي مخصوص اختيارين کان منظورين.",
          },
        ],
      },
      {
        section: 'قرض جون مصنوعات',
        items: [
          {
            question: "ڪهڙيون قرض جون مصنوعات دستياب آهن؟",
            answer:
              "سافڪو مختلف قرضن جون مصنوعات پيش ڪري ٿو، جنهن ۾ شامل آهن:\n• انٽرپرائز ڊولپمينٽ قرض (30,000 روپيا - 300,000 روپيا)\n• لائيو اسٽاڪ ڊولپمينٽ قرض (30,000 روپيا - 300,000 روپيا)\n• ايگريڪلچر ڊولپمينٽ قرض (30,000 روپيا - 300,000 روپيا)\n• SME قرض (301,000 روپيا - 1,000,000 روپيا)\n• ذاتي قرض (50,000 روپيا - 300,000 روپيا)\n• عيدالاضحي قرض (50,000 روپيا - 300,000 روپيا)\n• اسڪول امپرومنٽ قرض (25,000 روپيا - 500,000 روپيا)\n• سولر قرض (6,000 روپيا - 1,500,000 روپيا)\n• آٽو فنانس قرض (20,000 روپيا - 500,000 روپيا)",
          },
          {
            question: "مختلف قرضن لاءِ مدت ڇا آهي؟",
            answer:
              "قرضن جي مدت هن طرح آهي:\n• انٽرپرائز ڊولپمينٽ قرض: 12-24 مهينا.\n• لائيو اسٽاڪ ڊولپمينٽ قرض: 6-24 مهينا.\n• ايگريڪلچر ڊولپمينٽ قرض: 6 مهينا.\n• ذاتي قرض: 12-24 مهينا.\n• اسڪول امپرومنٽ قرض: 12-24 مهينا.\n• SME قرض: 12-36 مهينا.\n• سولر قرض: 6-60 مهينا.\n• آٽو فنانس قرض: 12-24 مهينا.",
          },
          {
            question: "قرضن جي مالي چارجز ڇا آهن؟",
            answer:
              "چارجز هر سال فليٽ بيس تي حساب ڪيا ويندا آهن:\n• ايگريڪلچر ڊولپمينٽ قرض: 30%\n• لائيو اسٽاڪ ڊولپمينٽ قرض: 28%\n• ذاتي قرض: 32%\n• SME قرض: 30%\n• اسڪول امپرومنٽ قرض: 22%\n• سولر قرض: 28%\n• آٽو فنانس قرض: 30%",
          },
        ],
      },
      {
        section: 'اهليت ۽ دستاويزات',
        items: [
          {
            question: "قرض لاءِ ڪهڙا دستاويز ضروري آهن؟",
            answer:
              "عام گهرجون هيٺ ڏنل آهن:\n• اصل CNIC جو فوٽو.\n• تازو آن لائن فوٽو.\n• ڪيش فلو تجزيو.\n• پوسٽ ڊيٽڊ چيڪ.\n• رهائش/روزگار جو ثبوت.\n• اضافي دستاويز مصنوعات جي لحاظ سان مختلف آهن.",
          },
          {
            question: "ڇا عورتن لاءِ مخصوص گهرجون آهن؟",
            answer:
              "ها، عورتن کي قرض لاءِ درخواست ڏيندي هيٺين دستاويز مهيا ڪرڻا پوندا:\n• مرد گارنٽر جو CNIC (جهڙوڪ شوهر، والد، يا ڀاءُ).\n• سافڪو پاليسين مطابق صحيح ٿيل دستخط ٿيل اعلان.",
          },
          {
            question: "ڇا ڪن شعبن ۾ ڪم ڪندڙن کي قرض نٿا ڏنيون وڃن؟",
            answer:
              "ها، سافڪو ڪجهه شعبن ۾ ڪم ڪندڙن کي قرض نٿو ڏئي، جن ۾ وڪيل، قانون نافذ ڪندڙ آفيسر، ۽ اهڙن ڪاروبار ۾ شامل آهن جيڪي ماحولياتي نقصان يا خطرناڪ ڪيميڪلز ۾ ملوث آهن.",
          },
        ],
      },
      {
        section: 'قرض پروسيسنگ ۽ پاليسيون',
        items: [
          {
            question: "قرض جي ادائيگي لاءِ grace period ڇا آهي؟",
            answer:
              "بلٽ قرضن لاءِ ڇهه مهينن تائين grace period ڏنو ويندو آهي (ڪيش فلو جي بنياد تي). ماهوار قرضن لاءِ ادائيگي لاءِ grace period 45 ڏينهن تائين ٿي سگهي ٿي.",
          },
          {
            question: "قرض ڪندڙ قرض کي جلد ادا ڪري سگهن ٿا؟",
            answer:
              "ها، سافڪو قرض کي بغير ڪنهن پينلٽي جي جلد بند ڪرڻ جي اجازت ڏئي ٿو. قرض ڏيندڙن کي اصل رقم ۽ مالي چارجز ادا ڪرڻا پوندا.",
          },
          {
            question: "سافڪو جي قرضن جي پاليشن بابت ڇا آهي؟",
            answer:
              "جو قرض ختم ٿيڻ کان پوءِ واجب الادا آهي، اهو ايندڙ ٽي سال تائين ٻيهر قرض حاصل ڪرڻ لاءِ غير اهل ٿي سگهي ٿو. سافڪو جي CIB ڊسبرسمنٽ پاليسي جو پيروي ڪرڻ ضروري آهي.",
          },
        ],
      },
      {
        section: 'خاص خصوصيتون',
        items: [
          {
            question: "ڇا سافڪو خاص شعبن لاءِ مدد فراهم ڪري ٿو؟",
            answer:
              "ها، سافڪو مدد فراهم ڪري ٿو:\n• ڪاروبار ۽ ننڍن ڪاروبار لاءِ.\n• لائيو اسٽاڪ ۽ زرعي شعبن لاءِ.\n• سولر قرضن ذريعي نون توانائي جي سهولت لاءِ.\n• اسڪولن جي بهتري لاءِ قرضن جي مدد.",
          },
          {
            question: "گراهڪن لاءِ اضافي سهولت موجود آهي؟",
            answer:
              "سافڪو مالي تعليم، قرض ڏيندڙن جي تربيت، ۽ AML/CFT جي تعميل فراهم ڪري ٿو، جنهن سان قرضن جي اخلاقي ۽ ڄاڻ ۾ واڌارو ٿيندو آهي.",
          },
        ],
      },
      {
        section: 'رابطو ۽ سپورٽ',
        items: [
          {
            question: "قرض ڏيندڙ يا آفيسر مدد لاءِ ڪٿي رابطو ڪري سگهن ٿا؟",
            answer:
              "قرض ڏيندڙ پنهنجن متعلقہ شاخن سان رابطو ڪري سگهن ٿا يا سافڪو جي هيلپ لائن تي سوالن ۽ مدد لاءِ رابطو ڪري سگهن ٿا.",
          },
        ],
      },
    ],
  };

  const filteredFAQs = faqs[language]
    .map((section) => ({
      ...section,
      items: section.items.filter((faq) =>
        faq.question.toLowerCase().includes(searchText.toLowerCase())
      ),
    }))
    .filter((section) => section.items.length > 0);

  const toggleExpand = (sectionIndex, index) => {
    setExpandedIndex(
      expandedIndex === `${sectionIndex}-${index}` ? null : `${sectionIndex}-${index}`
    );
  };

  return (
    <ScrollView style={styles.container}>
    {/* Status Bar */}
    <AppStatusBar />

    {/* Header */}
    <View style={GlobalStyles.row}>
      <HeaderwithoutDialoge Theme={Colors} back={true} />
      <TextView
        type={'mini_heading22'}
        style={{
          paddingHorizontal: 0,
          marginTop: 55,
          fontSize: 15,
          marginRight: 20
        }}
        text="SAFCO Microfinance: FAQs"
      />
    </View>

    {/* Language Selector */}
    <View style={styles.languageSelector}>
  <Text style={styles.languageLabel}>Select Language:</Text>
  <View style={styles.dropdownContainer}>
    <Picker
      selectedValue={language}
      onValueChange={(itemValue) => setLanguage(itemValue)}
      style={styles.picker}
      dropdownIconColor={Colors.primary}
      mode="dropdown" 
    >
      <Picker.Item label="English" value="en" />
      <Picker.Item label="Urdu" value="ur" />
      <Picker.Item label="Sindhi" value="sd" />
    </Picker>
  </View>
</View>
    {/* FAQ Introduction */}
    <View style={styles.questionsCont}>
  <Text style={styles.paragraph}>
    {language === 'en'
      ? 'The following FAQs are designed to assist officers in processing customer applications in compliance with SAFCO’s credit policy. This document provides guidance on loan products, terms, eligibility, and other important aspects for better decision-making.'
      : language === 'ur'
      ? 'مندرجہ ذیل سوالات کا مقصد افسران کو SAFCO کی کریڈٹ پالیسی کے مطابق گاہک کی درخواستوں کو پروسیس کرنے میں مدد فراہم کرنا ہے۔ یہ دستاویز قرض کی مصنوعات، شرائط، اہلیت اور بہتر فیصلے کرنے کے لیے دیگر اہم پہلوؤں پر رہنمائی فراہم کرتی ہے۔'
      : 'هيٺين سوالات جو مقصد آفيسرن کي مدد ڏيڻ جو آهي، ان کي SAFCO جي ڪريڊٽ پاليسي جي مطابق گراهڪن جي درخواستن کي پروسيس ڪرڻ ۾ مدد ڪرڻ آهي۔ هي دستاويز قرضن جي مصنوعات، شرطن، اهلت ۽ بهتر فيصلن لاءِ ٻين اهم پہلوئن تي رهنمائي فراهم ڪري ٿو.'}
  </Text>

  <Text style={styles.subHeaderText}>
    {language === 'en' ? 'Who will see this information:' : language === 'ur' ? 'اس معلومات کو کون دیکھے گا:' : 'ھي معلومات ڪير ڏسندو:'}
  </Text>

  <View style={styles.rolesContainer}>
    <Text style={styles.roleItem}>• {language === 'en' ? 'Business Development Officer' : language === 'ur' ? 'کاروباری ترقی آفيسر' : 'ڪاروباري ترقي آفيسر'}</Text>
    <Text style={styles.roleItem}>• {language === 'en' ? 'Branch Manager' : language === 'ur' ? 'برانچ مينيجر' : 'برانچ مينيجر'}</Text>
    <Text style={styles.roleItem}>• {language === 'en' ? 'Verification Officer' : language === 'ur' ? 'تصديق آفيسر' : 'تصديق آفيسر'}</Text>
    <Text style={styles.roleItem}>• {language === 'en' ? 'Regional Manager' : language === 'ur' ? 'علائقائي مينيجر' : 'علائقائي مينيجر'}</Text>
    <Text style={styles.roleItem}>• {language === 'en' ? 'Zonal Manager' : language === 'ur' ? 'زونل مينيجر' : 'زونل مينيجر'}</Text>
    <Text style={styles.roleItem}>• {language === 'en' ? 'All users, who are associated with this application' : language === 'ur' ? 'سب صارف، جو اس درخواست سے منسلک ہیں' : 'سڀ صارف، جيڪي هن درخواست سان وابستہ آهن'}</Text>
  </View>
</View>


    {/* FAQ List */}
    <FlatList
      data={filteredFAQs}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index: sectionIndex }) => (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>{item.section}</Text>
          <FlatList
            data={item.items}
            keyExtractor={(faq, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.faqCard}>
                <TouchableOpacity
                  style={styles.questionContainer}
                  onPress={() => toggleExpand(sectionIndex, index)}
                >
                  
                  <Text style={styles.question}>{item.question}</Text>
                  <Text style={styles.icon}>
                    {expandedIndex === `${sectionIndex}-${index}` ? '-' : '+'}
                  </Text>
                </TouchableOpacity>
                {expandedIndex === `${sectionIndex}-${index}` && (
                  <Text style={styles.answer}>{item.answer}</Text>
                )}
              </View>
            )}
          />
        </View>
      )}
    />
  </ScrollView>
);
};

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#f4f4f4',
},

languageSelector: {
  flexDirection: 'row', 
  alignItems: 'center', 
  marginVertical: 10,
  paddingHorizontal: 20,
  marginBottom:5,
},
languageLabel: {
  fontSize: 14,
  color: '#333',
  marginRight: 10,
  fontWeight: 'bold', 
},
dropdownContainer: {
  backgroundColor: '#fff',
  borderRadius: 12,
  overflow: 'hidden',
  borderWidth: 1,
  borderColor: '#ccc',
  height: 40, 
  flex: 1, 
  shadowColor: '#000', 
  shadowOpacity: 0.1,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
  elevation: 2, 
},
picker: {
  marginTop:-5,
  height: '100%',
  width: '100%',
  paddingLeft: 10,
  fontSize: 14,
  color: '#333',
  justifyContent: 'center',
  marginBottom:10,
},
questionsCont: {
  marginTop: 5,
  paddingHorizontal: 16,
  backgroundColor: '#fff',
  paddingBottom: 20,
},
paragraph: {
  fontSize: 15,
  lineHeight: 20,
  color: '#333',
  marginBottom: 16,
},
subHeaderText: {
  fontSize: 16,
  fontWeight: 'bold',
  marginBottom: 6,
  color: '#333',
},
rolesContainer: {
  marginBottom: 10,
  paddingLeft: 20,
},
roleItem: {
  fontSize: 15,
  color: '#333',
  marginBottom: 5,
},
sectionContainer: {
  paddingHorizontal: 16,
  marginTop: 10,
},
sectionHeader: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
  marginBottom: 12,
},
faqCard: {
  backgroundColor: '#fff',
  marginBottom: 8,
  borderRadius: 8,
  padding: 16,
  elevation: 3,
},
questionContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
question: {
  fontSize: 15,
  fontWeight: '600',
  color: '#333',
  flex:1,
},
icon: {
  fontSize: 22,
  color: '#0066cc',
},
answer: {
  marginTop: 12,
  fontSize: 16,
  color: '#555',
  
},
});

export default Faqs;