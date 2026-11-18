export default function History() {
  return (
    <section className="article-section">

      {/* ── Row 1: Gopuram image LEFT · Tamil text RIGHT ── */}
      <div className="article-row">
        <div className="article-img-col">
          <img
            src="images/article_gopuram.jpg"
            alt="Thiruparankundram Gopuram"
            className="article-img"
            loading="lazy"
          />
        </div>
        <div className="article-text-col">
          <p className="article-para">
            இந்து மதத்தில் ஒரு முக்கியமான அங்கமாக விளங்குவது அதன் சம்பிரதாயங்களும்
            சடங்குகளும். இவை இந்து மதத்தில் அன்றாடும் நம்மோடு கலந்து வாழ்க்கை
            முறையாக பழக்கத்தில் உள்ளது. இது உடல் மற்றும் மன ரீதியில் சிறந்த
            பலனை தருவதோடு நாட்டிற்கும் ஒரு நல்ல எதிர்காலத்தை அமைத்துக் கொடுக்க
            வழிவகை செய்கிறது.
          </p>
          <p className="article-para">
            மக்களை பக்தி மார்க்கத்திலும் அறம் சார்ந்த வழியிலும் நடத்தி செல்ல
            இந்த மாதிரியான சடங்குகளும் பிரார்த்தனைகளும் மிகவும் அவசியம்.
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
            இந்த சம்பிரதாயங்களில் ஒன்றுதான் கார்த்திகை தீபத்தின் போது வீட்டிலும்,
            கோவில்களிலும், விளக்கேற்றுவது என்பது. ஒரு சில மலை சார்ந்த கோயில்களில்
            தொன்று தொட்டு பல நூறு ஆண்டுகளாக அந்த கோயிலுக்கு உரிதான மலை மீது
            அமைந்திருக்கும் கல் தூணில் ஒரு அகண்ட தீபம் ஏற்றப்படும் வழக்கம்
            வழிவழியாக கடைப்பிடிக்கப்பட்டுள்ளது.
          </p>
          <p className="article-para">
            இந்த தீபமானது கோயில் அடிவாரத்தில் குடி கொண்டிருக்கும் பக்தர்கள்
            அனைவரும் கண்டு மனம் உருகி பிரார்த்தனை செய்ய ஏதுவாக அமைந்தது.
            ஒரு சிலர் வயது மூப்பு காரணமாகவும் உடல் குறைபாடு காரணமாக மலை மீது
            உள்ள கோயிலுக்கு செல்ல முடியாதவர்கள் இந்த தீபத்தை அங்கு கோயில்
            கருவறையில் உள்ள கடவுளாக பாவித்து வணங்குவார்கள் — இப்படிப்பட்ட ஒரு
            புனிதமான வழிமுறையை தடுப்பது பாவமே ஆகும்.
          </p>
          <p className="article-author">— சுவாதி ஐயங்கார்</p>
        </div>
      </div>

    </section>
  )
}
