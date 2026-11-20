import MultilingualIntro from './MultilingualIntro'

export default function History() {
  return (
    <section className="article-section">

      {/* ============================================================
          TAMIL SECTION — ஆன்மீகப் பின்னணி & மரபு
          ============================================================ */}
      <div className="section-title-wrap">
        <h2 className="article-main-title">
          இங்கு மலையும் முருகப்பெருமான்.. மலையே முருகப்பெருமான்
        </h2>
        <div className="thin-rule" style={{ maxWidth: '180px', margin: '12px auto 28px' }} />
      </div>

      {/* ── Row 1: Gopuram image LEFT · Tamil text RIGHT ── */}
      <div className="article-row">
        <div className="article-img-col">
          <img
            src="images/article_gopuram.jpg"
            alt="Thiruparankundram Temple Gopuram"
            className="article-img"
            loading="lazy"
          />
        </div>
        <div className="article-text-col">
          <p className="article-para">
            இந்து மதத்தில் ஒரு முக்கியமான அங்கமாக விளங்குவது அதன் சம்பிரதாயங்களும் சடங்குகளும். இவை இந்து மதத்தில் அன்றாடும் நம்மோடு கலந்து வாழ்க்கை முறையாக பழக்கத்தில் உள்ளது. இது உடல் மற்றும் மன ரீதியில் சிறந்த பலனை தருவதோடு நாட்டிற்கும் ஒரு நல்ல எதிர்காலத்தை அமைத்துக் கொடுக்க வழிவகை செய்கிறது.
          </p>
          <p className="article-para">
            மக்களை பக்தி மார்க்கத்திலும் அறம் சார்ந்த வழியிலும் நடத்தி செல்ல இந்த மாதிரியான சடங்குகளும் பிரார்த்தனைகளும் மிகவும் அவசியம். இந்த கலியுகத்தில் சனாதன தர்மத்தின் பக்திமார்க்கம் தான் சகல சௌபாக்கியங்களும் நமக்கு அருளும். இதை நாம் நம் கடைபித்தே ஆகவேண்டும்.
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="article-divider" />

      {/* ── Row 2: Tamil text LEFT · Torch image RIGHT ── */}
      <div className="article-row row-reverse">
        <div className="article-img-col">
          <img
            src="images/article_torch.jpg"
            alt="Sacred Deepathoon Torch"
            className="article-img"
            loading="lazy"
          />
        </div>
        <div className="article-text-col">
          <p className="article-para">
            இந்த சம்பிரதாயங்களில் ஒன்றுதான் தினமும் வீட்டில் விளக்கு ஏற்றுவது. விசேஷமாக கார்த்திகை தீபத்தின் போது வீட்டிலும், கோவில்களிலும், விளக்கேற்றுவது என்பது மிகவும் விமர்சையாக கொண்டாடப்படும் பண்டிகை.
          </p>
          <p className="article-para">
            ஒரு சில மலை சார்ந்த கோயில்களில் தொன்று தொட்டு பல நூறு, ஆயிரம் ஆண்டுகளாக அந்த கோயிலுக்கு உரிதான மலை மீது அமைந்திருக்கும் கல் தூணில் ஒரு அகண்ட தீபம் ஏற்றப்படும் வழக்கம் வழிவழியாக கடைப்பிடிக்கப்பட்டுள்ளது.
          </p>
          <p className="article-para">
            இந்த தீபமானது கோயில் அடிவாரத்தில் குடி கொண்டிருக்கும் பக்தர்கள் அனைவரும் கண்டு மனம் உருகி பிரார்த்தனை செய்ய ஏதுவாக அமைந்தது. ஒரு சிலர் வயது மூப்பு காரணமாகவும் உடல் குறைபாடு காரணமாக மலை மீது உள்ள கோயிலுக்கு செல்ல முடியாதவர்கள் இந்த தீபத்தை அங்கு கோயில் கருவறையில் உள்ள கடவுளாக பாவித்து வணங்குவார்கள். இப்படிப்பட்ட ஒரு புனிதமான வழிமுறையை தடுப்பது பாவமே ஆகும். இந்த தீப தரிசனத்தை பார்க்க ஏதேனும் தடையாக இருப்பினும் (மரம் செடி, கொடி இல்ல மற்ற கட்டங்கள்) எதுவாக இருப்பினும் அதை கோயில் சார்ந்தவர்கள் கோயில் நிர்வாகித்தனர் அதை அப்புறப்படுத்தி விட்டு இந்த தீப தரிசனம் எல்லோருக்கும் கிடைக்குமாறு செய்வது வழக்கம். முதற்கண் எதுவும் தடையாக இருக்கக்கூடாது.
          </p>
        </div>
      </div>

      {/* ── Hill-Top Deepam Temples of India Infographic Card ── */}
      <div className="infographic-section-card">
        <div className="infographic-header">
          <span className="infographic-badge">பாரதத்தின் புனித மலைத்தல தீபங்கள்</span>
          <h3 className="infographic-title">Hill-Top Deepam Temples of India</h3>
          <p className="infographic-subtitle">
            Sacred Lights on the Hills &middot; Thirupparankundram Murugan Temple among the 6 Sacred Hilltop Abodes
          </p>
        </div>
        <div className="infographic-img-wrap">
          <img
            src="images/hill_top_deepam_temples.jpg"
            alt="Hill-Top Deepam Temples of India Map and Traditions"
            className="infographic-full-img"
            loading="lazy"
          />
        </div>
      </div>

      {/* ── Tamil Block 3: திருப்பரங்குன்றம் ── */}
      <div className="article-full-card">
        <h3 className="article-sub-heading">திருப்பரங்குன்றம்</h3>
        <p className="article-para">
          சிவன் மற்றும் முருகர் ஸ்தலமானது ஒரு விசேஷமான மலை ஆகும். இங்கு மலை முழுவதுமே சிவனாகவும், முருகனாகவும், மற்ற கடவுளாகவும் போற்றி வணங்கப்படுகின்றனர். ஆகவே இங்கு இந்த அமைப்பு ஒரு சிறப்பானது, மிகவும் விசேஷமானதும் கூட.
        </p>
        <p className="article-para">
          மலை உச்சியில் தான் விளக்கேற்ற வேண்டும் இதுதான் இந்து மதத்தின் சமய வழக்கங்களில் ஒன்று. இப்படி இருப்பினும் திருப்பரங்குன்றத்தில் ஒரு விசேஷமான சூழ்நிலை ஏனென்றால் இங்கு மலையே கோயிலாக பாவிக்கப்படுகிறது பொதுவாக கோவிலின் உச்சியில் கலசம் போன்ற இடங்களில் தீபம் ஏற்றுவது வழக்கம் உதாரணத்திற்கு எம தீபம் ஏற்ற வேண்டும் என்றால் கோயில் கோபுரத்தின் மேல் ஏற்றுவார்கள் ஏற முடிந்தவர்கள் ஏறி அங்கே ஏற்றுவார்கள் ஆகவே திருப்பரங்குன்றத்தில் மலை உச்சியில் தான் தீபம் ஏற்றப்பட வேண்டும் என்பது நியாயமான கருத்தாக இருக்கும் ஆகவே அதையேதான் பக்தர்களும் முயற்சித்து ஏற்ற வேண்டும் என்பது சமய சான்றோர்களின் சிந்தனையாகவும் இருக்கும்.
        </p>
        <p className="article-para">
          இங்கு நான் சென்னை உயர்நீதிமன்றம் கூறியதை நினைவுபடுத்த விரும்புகிறேன். சமீபத்தில் அவர்களிடம் வந்த ஒரு வழக்கை விசாரிக்கும் போது அந்த வழக்கை நன்றாக விசாரித்துவிட்டு உத்தரவு பிறப்பித்த போது நீதிபதிகள் ஆங்கிலத்தில் இந்த ஒரு வார்த்தையை சொல்லி இருந்தார்கள் அதன் ஆங்கிலத்தில் எழுதுகிறேன் அதை நீங்கள் கூகுளில் தேடி பார்த்து புரிந்து கொள்ளவும்.
        </p>

        <blockquote className="article-quote">
          &ldquo;Hinduism is Inclusive, Abrahamic faith is Exclusive.&rdquo;
        </blockquote>

        <p className="article-para">
          ஆகவே இந்துக்கள் தான் இந்த தாய் திருநாட்டின் பூர்வ குடிமக்கள், உரிமையாளர்கள். சனாதன தர்மம் தான் நாம் நாட்டின் தாய் மதம், இந்த நாட்டின் , நாட்டுமக்களின் வழிமுறை. இதை தினம் தினம் நினைவில் எழுதி வையுங்கள். சனாதன தர்மத்தின் சிறப்பு இறைவனை அடைய பல்வேறு வழிகள் இருக்கிறது என்பதை நம்புவது.
        </p>

        <div className="spiritual-appeal-card">
          <p className="spiritual-highlight-para">
            நம்மை காக்கும் நமது முருகப்பெருமானை, நாம் போற்றி, புகழ்ந்து கொண்டாடுவோமாக.
          </p>
          <div className="murugan-callout">
            வெற்றிவேல் முருகனுக்கு அரோகரா!
          </div>
          <p className="spiritual-appeal-para">
            நீங்கள் உங்கள் குழந்தைகளோடு இந்த தீபத்தை ஏற்றுங்கள்.
          </p>
          <p className="spiritual-oil-appeal">
            எண்ணெய் 🪔 🪔 🪔 வாங்க பொருள் உதவி செய்து மற்றவர்களும் தீபம் ஏற்ற உதவிடுங்கள்.
          </p>
          <div className="deepam-emojis">🪔 🪔 🪔</div>
        </div>

        <p className="article-author">— சுவாதி ஐயங்கார்</p>
      </div>

      {/* ============================================================
          UNITING BHARATH — ENGLISH SECTION (By Swathi Iyengar)
          ============================================================ */}
      <div className="uniting-bharath-container">
        <div className="section-title-wrap">
          <h2 className="article-main-title english-title">
            Uniting Bharath &middot; Uniting all Hindus through this Deepathoon
          </h2>
          <div className="thin-rule" style={{ maxWidth: '240px', margin: '14px auto 24px' }} />
        </div>

        {/* ── Multilingual Rotating Intro (Hindi, French, Sinhala, German · 8s cycle · pause on hover) ── */}
        <MultilingualIntro />

        {/* ── Row 1: Archival Temple Image LEFT · Text RIGHT ── */}
        <div className="article-row">
          <div className="article-img-col">
            <img
              src="images/court_vintage_temple.jpg"
              alt="Archival View of Thiruparankundram Temple"
              className="article-img"
              loading="lazy"
            />
            <span className="img-caption">Thiruparankundram Temple &amp; Sacred Hill of Dharma</span>
          </div>
          <div className="article-text-col">
            <p className="article-para en">
              We the proud Hindus true sons and daughters of the Bharat are deeply pained by the development in the Deepathoon issue and the present government elected by the large by the votes casted by the Hindus is approaching the supreme court with some lame excuse to deny the Hindus to follow their faith. Unfair and this is a new form of fascism.
            </p>
            <p className="article-para en">
              However we will sit in our home puja room chanting saravana bhava will light the lamp on the Deepathoon digitally.
            </p>
            <p className="article-para en">
              All you have to do is to pray and drag the light / theepandham to the top of the pillar you will witness Thiru Karthigai Deepam lit by your own heart and seeking blessings of Lord Muruga to you and your family and friends.
            </p>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="article-divider" />

        {/* ── Row 2: Text LEFT · Illuminated Gopuram Image RIGHT ── */}
        <div className="article-row row-reverse">
          <div className="article-img-col">
            <img
              src="images/court_night_gopuram.jpg"
              alt="Thiruparankundram Gopuram Illuminated with Vel at Night"
              className="article-img"
              loading="lazy"
            />
            <span className="img-caption">Thiruparankundram Gopuram with radiant Vel illumination</span>
          </div>
          <div className="article-text-col">
            <p className="article-para en">
              I am deeply appalled and saddened by the development that is happening in the state of Tamil Nadu, eminent judges quoting the law of the land have permitted the lighting of lamp at the Deepathoon on top of the hill, yet the government elected with the large votes casted by the Hindus denying and betraying the Hindus.
            </p>
            <p className="article-para en">
              I think this is a time for the Hindus to realize their mistake one after other.
            </p>
            <p className="article-para en">
              I request the Prime minister and the Home minister and the great Hindu organisations like RSS and VHP, to lead against such an unfavorable attitude only showed towards Hindus. Is secularism is only binding on Hindus this is a question you have to ask and we the Hindus have to ask you ? As you are elected to protect and serve us.
            </p>
            <p className="article-para en">
              I perceive I foresee the only is to declare Bharat as Hindu Rashtra and Hindus must have the first right Hindus must have a strong voice to protect their identity the heritage the tradition of the country Bharat.
            </p>
          </div>
        </div>

        {/* ── Full Card: Dharma, Civilization, Unity of All Dharmic Traditions ── */}
        <div className="article-full-card">
          <p className="article-para en">
            There is no Bharath if no Hindus and No Hindus if there tranditions and customs are chocked and stiffled in the name of secularism or imaginary Ghost portrayed by an elected government on the behest of some religious community and appeasement policy.
          </p>

          <p className="article-para en">
            Bharath is a very very ancient civilization and the latest two Ithasas Ramayana and Mahabharata are 7000 and 5000 years old. Much before that we have many avatars and the foundation for all these beautiful Ithasas is Santana Dharma. We are facing a situation worse than what Mughals did to Hindus and Sikhs. Today certain Anti Hindu forces are using our own constitution to belittle our faith and traditions and prohibit Hindus to carry out their day to day life including spiritual life using our own law. Is this fair ? I am asking all Hindus, Sikhs, Buddhists, Jain&apos;s.
          </p>

          <p className="article-para en">
            Just to give one example The great Mathematician Srinivasa Ramanujam was inspired by a temple in South of India. See how important for us this temple identity is. Hinduism is an unique faith unlike other faiths that Western world and West Asia practices. See the beauty and depth of Hinduism which thrives on live and let live and Universal wellness to all sentient beings. We are the last bastion of Dharma and many forces in the name of religion and secularism wants to weaken this, our Dharmic code using our own law and constitution.
          </p>

          <p className="article-para en">
            This is like termite eating the wood inside out. Enough of this atrocities directed against Hindus. I appeal to my brothers of Buddhist, Sikh and Jain traditions and other faith that was born in Bharath to unite together and build a strong community of Dharma and strong Bharatiya traditions and customs.
          </p>

          <div className="unity-slogan-box">
            <span className="unity-slogan-text">Jai Hind &middot; Bharath Mata Ki Jai</span>
          </div>

          <p className="article-author">— Swathi Iyengar</p>
        </div>
      </div>

    </section>
  )
}
