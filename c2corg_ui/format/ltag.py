"""
LTag Extension for Python-Markdown
====================================

See https://regex101.com/r/g2Zjqn/2/ for regex tests

"""

from __future__ import absolute_import
from __future__ import unicode_literals
from markdown.extensions import Extension
from markdown.blockprocessors import BlockProcessor
from markdown.util import etree
import re


class LTagProcessor(BlockProcessor):
    """ Process Tables. """

    RE_LTAG_BLOCK = re.compile(r'^(?:L#(?:[^|\n]*(?:\|[^|\n]*)+)\n?)+$')

    def __init__(self, parser):
        super(LTagProcessor, self).__init__(parser)

    def test(self, parent, block):
        is_table = self.RE_LTAG_BLOCK.search(block) is not None

        return is_table

    def run(self, parent, blocks):

        block = blocks.pop(0)
        row_count = 1

        if not self.test(parent, block):
            return

        rows = block.split('\n')
        table = etree.SubElement(parent, 'table')
        table.set('class', 'ltag')
        tbody = etree.SubElement(table, 'tbody')
        for row in rows:
            tr = etree.SubElement(tbody, 'tr')
            cols = row.split('|')
            for col in cols:
                td = etree.SubElement(tr, 'td')
                td.text = col.strip().replace('L#', "L" + str(row_count))
            row_count += 1


class LTagExtension(Extension):
    """ Add tables to Markdown. """

    def extendMarkdown(self, md, md_globals): # noqa
        """ Add an instance of TableProcessor to BlockParser. """
        if '|' not in md.ESCAPED_CHARS:
            md.ESCAPED_CHARS.append('|')
        md.parser.blockprocessors.add('table',
                                      LTagProcessor(md.parser),
                                      '<hashheader')


def makeExtension(*args, **kwargs): # noqa
    return LTagExtension(*args, **kwargs)
