import MarkdownDisplay from 'react-native-markdown-display';
import { Linking, StyleSheet } from 'react-native';
import { colors } from '../../theme';

export function Markdown({ children }: { children: string }) {
  return (
    <MarkdownDisplay
      style={markdownStyles}
      onLinkPress={(url) => {
        void Linking.openURL(url);
        return false;
      }}
    >
      {children}
    </MarkdownDisplay>
  );
}

const markdownStyles = StyleSheet.create({
  body: { color: colors.inkSoft, fontSize: 14, lineHeight: 23 },
  heading1: { color: colors.ink, fontSize: 18, fontWeight: '700', marginTop: 8 },
  heading2: { color: colors.ink, fontSize: 16, fontWeight: '700', marginTop: 8 },
  heading3: { color: colors.ink, fontSize: 15, fontWeight: '600', marginTop: 6 },
  paragraph: { marginTop: 0, marginBottom: 8 },
  strong: { color: colors.ink, fontWeight: '600' },
  link: { color: colors.cinnabar, textDecorationLine: 'underline' },
  blockquote: {
    borderLeftWidth: 2,
    borderLeftColor: colors.cinnabar + '66',
    paddingLeft: 10,
    marginVertical: 6,
  },
  code_inline: {
    backgroundColor: colors.ink + '10',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: 13,
  },
  bullet_list: { marginVertical: 4 },
  ordered_list: { marginVertical: 4 },
  list_item: { marginVertical: 2 },
  image: { borderRadius: 8, marginVertical: 6 },
});
