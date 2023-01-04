import titleLengthRule from './TitleLengthRule';
import imgTagWithAltAttributeRule from './ImgTagWithAltAttributeRule';
import aTagWithRelAttributeRule from './ATagWithRelAttributeRule';
import canonicalLinkRule from './CanonicalLinkRule';
import metaBaseRule from './MetaBaseRule';
import metaSocialRule from './MetaSocialRule';
import hTagsRule from './HTagsRule';
import noTooManyStrongTagsRule from './NoTooManyStrongTagsRule.js';
import noMoreThanOneH1TagRule from './NoMoreThanOneH1TagRule';


const defaultRules = {
  titleLengthRule,
  imgTagWithAltAttributeRule,
  aTagWithRelAttributeRule,
  canonicalLinkRule,
  metaBaseRule,
  metaSocialRule,
  hTagsRule,
  noTooManyStrongTagsRule,
  noMoreThanOneH1TagRule
};

export default defaultRules;

