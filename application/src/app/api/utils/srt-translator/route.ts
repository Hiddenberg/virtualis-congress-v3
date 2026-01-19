import { NextResponse } from "next/server";
import openai from "@/libs/openai";

export async function GET() {
   const originalSrt = `1
00:00:03,580 --> 00:00:10,980
Olá, eu sou Arnaldo Lichtenstein, professor da Faculdade de Medicina da Universidade de São Paulo,

2
00:00:11,820 --> 00:00:19,440
diretor do Serviço de Clínica Geral do Hospital das Clínicas, e é um grande prazer estar com vocês

3
00:00:20,260 --> 00:00:29,640
Para falar de um tema que pouca gente aprende nas faculdades, se ensina poucos a alunos e residentes,

4
00:00:30,620 --> 00:00:38,740
mas é de enorme importância na vida de um médico, que é o uso racional do laboratório clínico.

5
00:00:39,300 --> 00:00:45,040
Ou seja, que exames devemos pedir, que exames não devemos pedir.

6
00:00:45,700 --> 00:00:58,000
E isso, além do que vamos falar, o importante seria ter a acurácia de cada exame e que exame pode resolver a nossa dúvida clínica.

7
00:00:58,500 --> 00:01:10,660
E isso cada vez é mais importante quando se tem muito menos tempo de uma consulta e cada vez menos se conversa e se examina um paciente.

8
00:01:11,140 --> 00:01:19,600
E cada vez mais o exame erradamente assume um papel mais importante que a história do exame físico.

9
00:01:20,260 --> 00:01:31,660
Essa é uma foto de como surgiu esse grupo que ensina, que estuda esse assunto no Hospital das Clínicas da Faculdade de Medicina.

10
00:01:32,060 --> 00:01:41,600
Essa é uma foto de 15 anos atrás e do grupo restaram apenas duas pessoas e foram substituídas por outras.

11
00:01:42,360 --> 00:01:50,760
Mas vamos tentar entender o que nós estudamos e o que nós podemos acrescentar na vida de cada um.

12
00:01:51,480 --> 00:02:13,460
Basicamente, esse grupo surgiu em 2011 com a finalidade de criar algoritmos, publicações, aulas e ações para minimizar esse problema dentro do Hospital das Clínicas, que a gente vai ver é enorme.

13
00:02:14,280 --> 00:02:37,860
Mas se a gente vir um panorama geral no American College of Physicians de 2019, antes da pandemia, já se alertava que o gasto com saúde nos Estados Unidos em 2017 atingia a quase 18% do PIB americano.

14
00:02:38,320 --> 00:02:47,260
Com um aumento progressivo desde 1960, muito maior do que o próprio produto interno bruto.

15
00:02:47,860 --> 00:02:55,220
Ou seja, a coisa tendia a crescer e vai explodir mais cedo ou mais tarde,

16
00:02:55,750 --> 00:03:00,040
numa verdadeira crise de saúde nos Estados Unidos.

17
00:03:00,600 --> 00:03:10,980
E esse grande gasto com a saúde não se traduziu numa melhor eficiência do serviço de saúde norte-americano,

18
00:03:11,680 --> 00:03:19,360
nos indicando que o serviço de saúde é caro e não melhor, portanto ineficiente.

19
00:03:19,660 --> 00:03:29,180
E parte disso é por gastos desnecessários e desses gastos os exames são parte fundamental.

20
00:03:29,240 --> 00:03:43,239
Se a gente ver por que o pedido de testes está crescendo, basicamente o que é descrito na literatura é, primeiro, a população envelhecendo.

21
00:03:44,040 --> 00:03:51,880
E envelhecendo tem mais comorbidades, mais doenças e, portanto, mais exames a serem feitos.

22
00:03:52,480 --> 00:04:00,220
Mas também existem várias causas ruins e a primeira delas é aquela que a gente falou,

23
00:04:00,820 --> 00:04:06,580
é a valorização do exame em relação ao exame clínico e a história.

24
00:04:07,420 --> 00:04:12,080
Temos também a insegurança profissional e a falta de experiência,

25
00:04:12,700 --> 00:04:20,940
ou seja, ele não acredita na sua hipótese diagnóstica baseada só na história e exame físico.

26
00:04:21,260 --> 00:04:28,999
Os exames também são pedidos em demasias por falta de protocolos de orientação aos profissionais.

27
00:04:29,970 --> 00:04:35,880
Os profissionais pedem muito exame porque não têm ideia de custos desses procedimentos.

28
00:04:36,460 --> 00:04:46,999
Existe ainda, principalmente nos Estados Unidos, uma postura defensiva em relação a um eventual processo civil

29
00:04:47,080 --> 00:04:53,180
em relação a como que você prova, por exemplo, que o paciente tinha pneumonia,

30
00:04:53,870 --> 00:04:56,740
se você não tem uma tomografia.

31
00:04:57,070 --> 00:05:01,300
E isso muitas vezes é decisivo se pedir exames a mais.

32
00:05:01,960 --> 00:05:10,100
Mas existe também o poder da mídia, da propaganda de fazer certos exames,

33
00:05:10,250 --> 00:05:13,220
e principalmente novos exames.

34
00:05:13,520 --> 00:05:21,640
Então a juventude é muito ansiosa de novos exames e ela acaba pedindo também muitos exames.

35
00:05:21,930 --> 00:05:28,620
Então nesse panorama ruim contra a valorização do médico,

36
00:05:28,870 --> 00:05:34,600
nós temos alguns dados que a gente vai dar em relação ao nosso serviço.

37
00:05:35,180 --> 00:05:43,540
A gente sabe, por exemplo, que a história faz quase 80% de todos os diagnósticos.

38
00:05:43,900 --> 00:05:51,060
A doutora Isabela Benciur, do nosso serviço lá do Hospital Universitário da Universidade de São Paulo,

39
00:05:51,480 --> 00:05:53,320
já publicou isso há anos.

40
00:05:53,640 --> 00:06:01,759
O exame físico acrescentaria mais 12% e o laboratório ficaria apenas com 10%.

41
00:06:02,120 --> 00:06:15,980
Sandler já tinha dado dados semelhantes, que 73% dos diagnósticos são feitos com história e exame físico, de todos os diagnósticos.

42
00:06:16,400 --> 00:06:26,500
Então, a gente sabe o poder de um médico bem informado em relação a saber tirar história e exame físico.

43
00:06:27,140 --> 00:06:37,240
No nosso serviço, no nosso serviço eu digo, no Hospital das Clínicas, se a gente contar apenas o Instituto Central,

44
00:06:37,830 --> 00:06:48,700
onde temos mais ou menos 800 leitos, sem contar o complexo inteiro, onde chegamos a 2.300 leitos,

45
00:06:49,240 --> 00:06:59,960
Só nesse prédio central nós fazemos 1 milhão de exames de sangue de laboratório por mês.

46
00:07:00,670 --> 00:07:04,560
São 11 milhões de exames por ano.

47
00:07:05,220 --> 00:07:16,080
Isso daqui é um volume gigantesco, é um volume que equivale só esse prédio a 15% de todo o país Canadá.

48
00:07:16,700 --> 00:07:29,800
Ou seja, alguma coisa está errada e a partir daí a gente criou esse grupo e começamos a ver e detalhar e esmioçar o problema.

49
00:07:30,500 --> 00:07:43,340
A primeira coisa que chamou muito a atenção e provavelmente acontece em muitos lugares do mundo é a famosa proteína C-reativa.

50
00:07:43,880 --> 00:07:53,400
Nós sabemos que a proteína C-reativa tem seu papel, mas é um papel muito menor do que ela ganha na prática médica.

51
00:07:54,040 --> 00:08:04,200
Ou seja, quando o doente está melhor, quando ele melhora com o tratamento, que poderia, por exemplo, receber alta,

52
00:08:04,700 --> 00:08:12,080
muitas vezes a alta hospitalar é adiada porque se pede uma proteína C-reativa e ainda ela está alta.

53
00:08:12,540 --> 00:08:18,560
Ou seja, se valoriza mais a proteína C do que os dados clínicos.

54
00:08:19,640 --> 00:08:23,920
E aí começa a dar margem para uma má medicina.

55
00:08:24,360 --> 00:08:29,440
Mas o que a gente viu lá no nosso serviço, isso lá perto de 2011,

56
00:08:30,060 --> 00:08:36,200
é que a proteína C reativa que era feita no nosso serviço era a ultrassensível,

57
00:08:36,599 --> 00:08:43,239
Aquela que os cardiologistas gostam, inclusive para indicar o uso de estatina mais precocemente,

58
00:08:44,080 --> 00:08:49,780
mas não vamos entrar nesse detalhe do estudo Jouper, que eu pessoalmente discordo muito.

59
00:08:50,240 --> 00:08:57,320
Mas se a gente usar proteína C-reativa ou ultrassensível para fazer um diagnóstico de inflamação,

60
00:08:57,840 --> 00:09:03,359
nós vamos gastar muito dinheiro à toa, porque a proteína C-outrassensível

61
00:09:03,740 --> 00:09:12,220
e ela vê quantidades pequenas de variação, enquanto que numa inflamação pode chegar a 200, 300, 400.

62
00:09:12,990 --> 00:09:23,640
E essa diluição que tem que ser feita multiplica em muito os custos desse exame que por si só tem uma pequena utilidade.

63
00:09:23,940 --> 00:09:33,180
E a primeira ação que a gente fez nesse grupo foi substituir a proteína C reativa ultrassensível pela normal.

64
00:09:33,960 --> 00:09:42,760
Com isso, uma simples atitude, economizou milhões do laboratório num ano.

65
00:09:43,130 --> 00:09:50,880
Então pensem se o laboratório de vocês faz proteína C ultrassensível ou não.

66
00:09:51,300 --> 00:10:04,520
E nesse trabalho, nesse paper, fizemos uma grande revisão de utilidades e de principalmente não utilidades da proteína C reativa.

67
00:10:05,620 --> 00:10:10,360
Mas aí nós começamos a entender o problema.

68
00:10:10,940 --> 00:10:23,100
Nessa outra publicação, basicamente, nós pegamos todos os pacientes que internaram na enfermaria Teochefio durante um ano.

69
00:10:23,520 --> 00:10:39,940
Uma enfermaria que tinha na época 48 leitos, pegamos mais ou menos mil internações e vimos todos os exames de laboratório pedido nesse período de um ano.

70
00:10:40,420 --> 00:10:45,940
E aí começou uma percepção que nós não tínhamos.

71
00:10:46,460 --> 00:10:58,440
O primeiro grande dado foi que a média diária de exames por paciente foi de 9,5.

72
00:10:58,510 --> 00:11:07,440
O que significa? A cada dia se pedia sódio, potássio, ureia, creatinina, micemia, etc.

73
00:11:08,420 --> 00:11:11,040
nove exames por doente.

74
00:11:11,560 --> 00:11:17,140
Para os senhores terem ideia, em hospitais de complexidade igual ou semelhante,

75
00:11:17,520 --> 00:11:20,620
como por exemplo, John Hopkins nos Estados Unidos,

76
00:11:21,240 --> 00:11:23,540
Clínica Mayo, etc.,

77
00:11:23,640 --> 00:11:29,400
quando se chega perto de três exames por dia por paciente,

78
00:11:29,860 --> 00:11:34,740
começa-se ter um alarme no hospital e ver o que está errado.

79
00:11:35,400 --> 00:11:41,360
Nós tínhamos três vezes mais o pedido do que é admissível.

80
00:11:41,960 --> 00:11:48,740
Isso por si só já gerou quase um pânico no grupo, mas as coisas pioraram.

81
00:11:49,060 --> 00:12:09,520
Primeira coisa, nós víamos que essa lei de 2080, ou seja, os 18 ou 20 exames principais eram responsáveis por 70, 80% de todos os pedidos.

82
00:12:10,020 --> 00:12:15,640
Ou seja, eram exames que se repetiam sistematicamente.

83
00:12:16,140 --> 00:12:27,040
Ou seja, sóleo, potássio, creatinina, ureia, hemograma, proteína C reativa, oela de novo, magnésio, fósforo, fórum e assim por diante.

84
00:12:27,480 --> 00:12:33,080
Ou seja, poucos números de exame, pequeno número, responsável pela maioria.

85
00:12:33,960 --> 00:12:37,760
Mas o problema não era só esse.

86
00:12:38,660 --> 00:12:47,740
Basicamente, nós temos nesse gráfico que os mesmos exames eram pedidos

87
00:12:48,960 --> 00:12:52,840
independentes do diagnóstico do doente.

88
00:12:53,280 --> 00:13:00,480
Aqui nessa curva temos grupo de neoflasias, grupo de problemas do sistema digestivo,

89
00:13:01,000 --> 00:13:04,440
doenças infecciosas, doenças cardíacas e assim por diante.

90
00:13:04,660 --> 00:13:08,580
E sempre os mesmos pedidos de exames.

91
00:13:08,920 --> 00:13:16,700
Ou seja, independente do que tinha o paciente, se pegue o mesmo tipo de exame.

92
00:13:17,400 --> 00:13:20,440
Ou seja, alguma coisa está errada.

93
00:13:20,860 --> 00:13:23,800
Mas as coisas ainda eram piores.

94
00:13:24,680 --> 00:13:25,100
Por quê?

95
00:13:25,500 --> 00:13:39,120
se repetia constantemente um exame, mesmo que o exame fosse normal e não houvesse mudança na situação clínica do doente.

96
00:13:39,470 --> 00:13:47,640
Nós temos alguns exemplos terríveis do exame de creatinina se pedir diariamente para o paciente,

97
00:13:48,140 --> 00:13:53,500
independente se ele está tomando diurético, independente se ele fez hipovolemia,

98
00:13:54,040 --> 00:14:02,100
independente se ele fez exames com contraste, independente de modificações da sua situação clínica.

99
00:14:02,640 --> 00:14:09,820
Ou seja, nós vimos que se pede muito exame, que os exames são mal pedidos

100
00:14:10,160 --> 00:14:16,320
e que se repete exames desnecessariamente durante a internação.

101
00:14:16,940 --> 00:14:22,700
Ou seja, é um panorama muito tenebroso que a gente começou a ver.

102
00:14:23,160 --> 00:14:33,480
E aí a gente começou a estudar cada um dos exames, dos analitos, como dizem nossos patologistas clínicos.

103
00:14:34,080 --> 00:14:39,720
O primeiro que a gente foi estudar foi o cálcio sérico.

104
00:14:40,320 --> 00:14:46,799
E aí a grande dúvida sobre pedir cálcio total ou cálcio iônico.

105
00:14:47,920 --> 00:14:48,940
Por que faz diferença?

106
00:14:49,680 --> 00:14:56,380
Porque o cálcio iônico, para vocês terem uma ideia, custa 8 vezes mais do que o cálcio total.

107
00:14:57,080 --> 00:15:07,280
Ou seja, é mais barato se fazer cálcio total e albumina para uma eventual correção do que fazer o cálcio iônico.

108
00:15:07,840 --> 00:15:16,440
Em revisões que a gente viu, é absolutamente contraindicado pedir os dois juntos.

109
00:15:16,810 --> 00:15:27,100
Se pedir calcio iônico em algumas situações já é inadmissível, pedir total e iônico ao mesmo tempo é inadmissível.

110
00:15:27,540 --> 00:15:46,340
E aí, nesse trabalho de revisão, a gente elaborou um algoritmo de situações de quando pedir cálcio iônico, por exemplo, no pronto-socorro, na enfermaria, na terapia intensiva e no ambulatório.

111
00:15:46,720 --> 00:15:50,540
E aí determinamos o que é razoável o pedido.

112
00:15:50,960 --> 00:15:57,420
Em terapia intensiva, o pedido é mais liberal de calciônico.

113
00:15:57,800 --> 00:16:03,380
Pacientes oncológicos é mais liberal se pedir calciônico.

114
00:16:03,780 --> 00:16:11,920
Mas um doente internado por motivos mais corriqueiros, absolutamente não deve ser.

115
00:16:12,320 --> 00:16:16,460
E acima de tudo, nunca os dois juntos.

116
00:16:17,140 --> 00:16:18,980
E aí o que a gente fez?

117
00:16:19,400 --> 00:16:27,280
A gente começou uma campanha no hospital, aqueles algoritmos eram colados em banners,

118
00:16:27,800 --> 00:16:36,760
eram feitos reuniões com os residentes, eram feitos palestras, eram feitas uma grande propaganda.

119
00:16:37,540 --> 00:16:49,400
E depois disso, para nossa surpresa, melhorou, coisa que não é comum só com a educação e com a propaganda.

120
00:16:50,020 --> 00:17:02,340
Depois de alguns anos fazendo isso, nós vimos que pelo menos o pedido de calcio único e calcio total caiu drasticamente.

121
00:17:02,820 --> 00:17:15,980
Ou seja, uma das primeiras soluções que a gente viu para esse pedido errado de exames é ser agressivo em termos de educação,

122
00:17:16,420 --> 00:17:21,920
colocar na cabeça das pessoas que isso não deve ser feito.

123
00:17:22,150 --> 00:17:32,140
E até hoje, depois de quase 10 anos do primeiro trabalho, o pessoal ainda me atribui como o grande inimigo do caos.

124
00:17:33,180 --> 00:17:35,100
É bom ter essa fama também.

125
00:17:36,100 --> 00:17:45,920
Seguindo em produtos, em laboratórios polêmicos, nós fomos estudar a vitamina D.

126
00:17:47,160 --> 00:17:53,560
Fizemos uma grande revisão de como se começou a epidemia de pedir vitamina D,

127
00:17:54,140 --> 00:17:56,920
o que significa uma vitamina D baixa.

128
00:17:57,320 --> 00:18:06,720
e nessa revisão colocamos, inclusive, como que se foi estipulado um valor normal de vitamina D.

129
00:18:07,130 --> 00:18:11,940
E pasmem, foi feito com apenas 200 pacientes.

130
00:18:12,730 --> 00:18:19,620
E mais ainda, todos sabem que a vitamina D varia de acordo com a época do ano

131
00:18:19,890 --> 00:18:23,660
e com a latitude no país que você está.

132
00:18:24,780 --> 00:18:30,520
Países equatoriais têm vitamina D na sua população maiores que países escandinavos.

133
00:18:30,720 --> 00:18:33,740
No verão, maior do que no inverno.

134
00:18:33,900 --> 00:18:42,620
E aí o nível virou uma epidemia de que todos precisariam receber vitamina D.

135
00:18:42,980 --> 00:18:47,720
E a indústria farmacêutica aí por trás alimentando.

136
00:18:48,600 --> 00:18:56,160
E nessa revisão a gente viu das ações extra-ósseas da vitamina D

137
00:18:56,560 --> 00:19:04,980
e vimos que não há ação extra-óssea que justifique o pedido de vitamina D.

138
00:19:05,780 --> 00:19:06,320
Nenhum.

139
00:19:06,840 --> 00:19:15,400
E a vitamina D foi retirada por um tempo do menu de exames a serem pedidos no hospital das clínicas.

140
00:19:16,100 --> 00:19:21,700
houve, obviamente, brigas, discussões e ela voltou a ser dosada,

141
00:19:22,240 --> 00:19:27,420
mas o número injustificável voltou a cair.

142
00:19:28,160 --> 00:19:32,260
Felizmente, aí com o tipo segundo de ação,

143
00:19:32,600 --> 00:19:36,800
que não era a educação, mas simplesmente a proibição.

144
00:19:37,800 --> 00:19:40,380
E esse trabalho causou um impacto,

145
00:19:40,820 --> 00:19:43,920
e isso nós estamos falando há 12 anos atrás,

146
00:19:44,700 --> 00:19:48,880
a ponto de eu ser convidado por uma revista brasileira

147
00:19:49,150 --> 00:19:57,900
de fazer um editorial que justificasse essa afirmação que nós fizemos.

148
00:19:58,740 --> 00:20:05,660
Para vocês terem uma ideia, a vitamina D, a epidemia, surgiu na Austrália, na verdade,

149
00:20:06,340 --> 00:20:12,340
quando algumas décadas atrás se viu uma epidemia de câncer de pele.

150
00:20:13,040 --> 00:20:14,700
E aí o que se fez?

151
00:20:15,050 --> 00:20:21,560
Se fez uma propaganda gigantesca do uso de protetor solar de alta numeração.

152
00:20:21,830 --> 00:20:30,320
Se distribuí em praias de graça protetores solares e a epidemia do câncer diminuiu,

153
00:20:30,760 --> 00:20:38,140
mas diminuiu-se também a absorção dos raios ultravioletas e aí houve deficiência de vitamina D.

154
00:20:38,680 --> 00:20:42,340
Nesse extremo poderia eventualmente se justificar.

155
00:20:42,920 --> 00:20:45,080
mas não no nosso dia a dia.

156
00:20:47,880 --> 00:20:56,920
Outro analito de grande controvérsia é o que eu chamo do maldito dímero D.

157
00:20:57,940 --> 00:21:06,900
Quem trabalha em pronto-socorro vê se para qualquer dor torácica se pede o dímero D.

158
00:21:07,460 --> 00:21:10,880
E aí ele vem alto e a pessoa não sabe o que fazer.

159
00:21:11,740 --> 00:21:22,520
Lembro até a todos que o Dímero D foi criado o exame e a utilidade dele basicamente é para,

160
00:21:23,100 --> 00:21:32,300
numa hipótese diagnóstica baixa de tromboembolismo venoso, o Dímero D exclui o diagnóstico.

161
00:21:32,450 --> 00:21:37,600
E essa interpretação foi mal feita e é mal feita.

162
00:21:38,080 --> 00:21:46,160
Por exemplo, quando não se há hipótese de tromboembolismo venoso e embolia de pulmão, não deve se pedir.

163
00:21:46,900 --> 00:21:56,320
Basicamente, se a pessoa tem um trauma torácico nítido com falta de ar de espinéia, não é para se pedir DIMEROD,

164
00:21:57,320 --> 00:21:59,920
porque não há essa hipótese.

165
00:22:00,320 --> 00:22:09,800
Mas a gente estudou especificamente o Dímero D durante a pandemia de Covid, que no nosso país foi devastadora.

166
00:22:10,980 --> 00:22:16,640
700 mil pessoas morreram no nosso país nesses dois, três anos.

167
00:22:17,180 --> 00:22:30,540
E nós vimos que o DIMERUD na pandemia, no Covid, tinha uma relação absurda, enorme, com mortalidade.

168
00:22:31,060 --> 00:22:38,900
E principalmente esses níveis da curva Roque, acima de 8 vezes o limite superior.

169
00:22:39,580 --> 00:22:51,420
Ou seja, quando o DIMERUD é 500 no nosso laboratório e estava 4 mil, aumentava-se em pelo menos 3 vezes a mortalidade.

170
00:22:51,900 --> 00:23:02,960
Só que a gente foi mais profundamente nesse diagnóstico e vimos que a mortalidade não era por tromboembolismo venoso.

171
00:23:04,220 --> 00:23:12,400
Significando que o dímero D, como a gente já sabia, é uma proteína também de inflamação.

172
00:23:12,980 --> 00:23:23,700
Ou seja, não estava marcando só tromboembolismo danoso, estava marcando inflamação e há exemplo da proteína C reativa,

173
00:23:24,120 --> 00:23:33,760
indicando uma gravidade maior do doente e não necessariamente aquilo que os médicos estavam procurando.

174
00:23:34,240 --> 00:23:38,860
Ou seja, doentes mais inflamados correram mais por serem mais graves.

175
00:23:41,220 --> 00:23:46,360
Outra, e isso gerou também uma polêmica enorme sobre a trombose,

176
00:23:46,780 --> 00:23:53,500
e continuamos na sequência desse trabalho e vimos a incidência do tromboembolismo venoso

177
00:23:53,710 --> 00:23:58,219
no paciente com Covid, que chegava perto de 8%.

178
00:23:58,580 --> 00:24:06,140
E se a gente fizer a correção da gravidade dos pacientes da COVID e não COVID,

179
00:24:07,060 --> 00:24:14,540
vimos que não era muito diferente de uma trombose de pacientes muito graves de UTI não COVID.

180
00:24:15,280 --> 00:24:26,000
Portanto, a COVID aumentava um pouco a trombose, mas, de novo, o marcador de merudê não estava marcando a trombose,

181
00:24:26,180 --> 00:24:28,920
Estava marcando a gravidade.

182
00:24:30,320 --> 00:24:35,760
Seguindo nisso, a gente fez um trabalho diferente.

183
00:24:36,390 --> 00:24:44,400
Nós pegamos os residentes que pedem exames no nosso serviço.

184
00:24:44,820 --> 00:24:55,120
Ou seja, os residentes têm total autonomia de pedir qualquer exame de laboratório.

185
00:24:55,540 --> 00:24:58,860
E a gente fez um trabalho interessante, na minha opinião.

186
00:24:59,210 --> 00:25:08,000
Nós pegamos 36 R1, ou seja, recém-formados, acompanhando 320 pacientes.

187
00:25:08,570 --> 00:25:16,500
E aí nós perguntamos para o residente, na entrada, na primeira consulta, todos os exames feitos

188
00:25:16,940 --> 00:25:27,320
e depois do diagnóstico, exame por exame, qual foi a utilidade desse exame para esse paciente.

189
00:25:27,900 --> 00:25:33,380
Utilidade não só para fazer diagnóstico, e a gente vai esclarecer daqui a pouquinho.

190
00:25:33,880 --> 00:25:44,760
E aí a gente viu que o próprio residente que pedia exame achou que quase 20% dos exames que eles pediram

191
00:25:45,160 --> 00:25:47,880
não tinha qualquer utilidade.

192
00:25:48,440 --> 00:25:52,360
Isso independente da gravidade do paciente.

193
00:25:53,040 --> 00:25:59,240
E olha que a gente deu uma chance enorme do residente se justificar para isso.

194
00:25:59,560 --> 00:26:04,240
Se foi para fazer o diagnóstico, se foi para fazer o prognóstico,

195
00:26:04,600 --> 00:26:08,080
se foi para fazer tratamento, orientar tratamento,

196
00:26:08,090 --> 00:26:13,880
ou eventualmente até prevenção, promoção da saúde no paciente já com uma queixa.

197
00:26:14,540 --> 00:26:22,300
Ou seja, mesmo em todas essas categorias, o próprio residente viu que 1 em 5 doentes,

198
00:26:22,820 --> 00:26:25,220
exames pedidos, não serviam para nada.

199
00:26:25,670 --> 00:26:31,400
Há trabalhos na literatura que pessoas externas avaliando o pedido de exames,

200
00:26:31,780 --> 00:26:39,960
a desnecessidade, o desperdício dos exames pode chegar a 50%.

201
00:26:40,580 --> 00:26:53,940
E se esse dado for correto, nós estamos falando em nosso serviço de 500 mil exames por mês de desperdício absoluto.

202
00:26:54,480 --> 00:27:08,000
Ou seja, nós fizemos algumas estratégias, ou educação, ou proibição, ou eventualmente a autoavaliação de quem pede.

203
00:27:08,580 --> 00:27:19,700
E isso gerou para a gente uma tentativa de uma ação que talvez possa se replicar em outros serviços.

204
00:27:20,210 --> 00:27:35,160
Em cada sala de atendimento de residentes internos, nós colocamos esse checklist para as pessoas pensarem antes de pedir qualquer exame.

205
00:27:35,720 --> 00:27:40,040
E basicamente significa esses seis pontos.

206
00:27:41,060 --> 00:27:46,040
Certifique-se que não há o mesmo exame já em andamento.

207
00:27:46,340 --> 00:27:57,180
Isso é muito comum em culturas, em uroculturas, onde, por exemplo, o interno pede o exame de manhã e o residente à tarde,

208
00:27:57,420 --> 00:28:01,980
e aí se tem dois exames iguais pedidos desnecessariamente.

209
00:28:02,700 --> 00:28:06,960
A realização desse exame é segura para a saúde do doente?

210
00:28:07,500 --> 00:28:12,960
Muitas vezes, a exemplo não de laboratório, mas por exemplo uma colonoscopia,

211
00:28:13,460 --> 00:28:17,760
você pode fazer mais mal do que bem um paciente.

212
00:28:18,680 --> 00:28:26,480
O exame é coerente com a hipótese diagnóstica e essa mensagem tem duas dentro dela.

213
00:28:26,880 --> 00:28:34,320
A primeira é que você deva ter uma hipótese diagnóstica antes de pedir exames.

214
00:28:34,820 --> 00:28:42,520
A gente ironiza, por exemplo, nossos colegas neurologistas que só sabem fazer hipótese diagnóstica

215
00:28:42,980 --> 00:28:46,480
depois de uma ressonância e de uma coleta de líquor.

216
00:28:47,020 --> 00:28:52,140
Ironias à parte, nós temos que ter hipótese para fazer.

217
00:28:52,600 --> 00:29:00,240
E depois, se é coerente, se o exame que você pede pode esclarecer a sua hipótese de diagnóstico.

218
00:29:00,660 --> 00:29:06,700
Ou a evolução clínica justifica a solicitação ou repetição do exame.

219
00:29:07,060 --> 00:29:08,440
O que significa isso?

220
00:29:08,960 --> 00:29:11,080
Aqui é o exemplo da creatinina.

221
00:29:11,400 --> 00:29:18,060
Eu só vou repetir a creatinina se o paciente tem alguma mudança no seu status,

222
00:29:18,580 --> 00:29:20,360
se o exame anterior for normal.

223
00:29:20,460 --> 00:29:24,940
O resultado desse exame pode mudar a conduta?

224
00:29:25,560 --> 00:29:37,560
Ou seja, se é um exame por pura curiosidade de se ver alterado, mas a conduta já está sendo feita ou não vai ser alterada, pense antes de pedir esse exame.

225
00:29:38,140 --> 00:29:40,600
E por fim, a mais contundente.

226
00:29:40,960 --> 00:29:48,080
Se eu não pedir esse exame, eu prejudicarei o paciente ou simplesmente não vai fazer diferença?

227
00:29:48,600 --> 00:29:58,660
Então isso é uma ideia que a gente teve em relação ao checklist, cuja história do checklist eu não sei se todos conhecem,

228
00:29:59,050 --> 00:30:06,080
mas a história do checklist, se me permitem, em dois minutinhos para a gente conversar,

229
00:30:08,840 --> 00:30:12,840
tem um livro maravilhoso que chama o Manifesto do Checklist.

230
00:30:14,420 --> 00:30:21,620
Basicamente, a história veio da aviação, como todos sabem, mas nem todo mundo sabe como começou.

231
00:30:22,300 --> 00:30:32,560
No final da Segunda Guerra, os Estados Unidos estavam em dúvida de como acabar a guerra.

232
00:30:33,040 --> 00:30:40,940
E eles pensaram, se um avião pequeno carrega tantos quilos de bomba e destrói tantas cidades,

233
00:30:41,680 --> 00:30:48,060
Se a gente fizer um avião dez vezes maior e carregar dez vezes mais bombas,

234
00:30:48,500 --> 00:30:53,420
poderemos destruir dez vezes mais e acabar logo essa guerra.

235
00:30:53,900 --> 00:31:02,420
E fizeram isso, montaram um avião dez vezes maior e na sua exibição em frente ao Pentágono,

236
00:31:02,880 --> 00:31:06,900
chamaram o Major de maior experiência na aeronáutica.

237
00:31:07,580 --> 00:31:21,400
E na frente de todo o Pentágono, ele pilotou o avião, ele levantou o voo e depois de alguns metros, o avião caiu, explodiu e o Major faleceu.

238
00:31:22,560 --> 00:31:28,400
E aí os Estados Unidos abandonaram esse projeto e foram para a bomba atômica.

239
00:31:28,920 --> 00:31:32,820
E esse foi um divisor de águas da humanidade.

240
00:31:33,460 --> 00:31:34,980
O que aconteceu depois?

241
00:31:35,980 --> 00:31:45,060
Depois de acabar a guerra, foram rever esse projeto inicial e o que viram era perfeitamente viável.

242
00:31:45,700 --> 00:31:58,760
O que aconteceu foi que o Major, com toda a sua experiência, viu a responsabilidade e não fez os procedimentos passo a passo da piloto de avião.

243
00:31:59,720 --> 00:32:04,760
E aí, a partir daí, se viu a fundamental fazer esse checklist.

244
00:32:05,540 --> 00:32:07,660
Por que o autor fala isso?

245
00:32:07,940 --> 00:32:15,540
Porque a Organização Mundial de Saúde encarregou ele de diminuir a mortalidade dos centros cirúrgicos do mundo.

246
00:32:16,040 --> 00:32:19,780
E foi aí que começou o checklist do centro cirúrgico.

247
00:32:20,200 --> 00:32:29,180
E aí nós, humildemente, usamos essa estratégia para tentar diminuir uma outra catástrofe mundial.

248
00:32:30,800 --> 00:32:42,380
Esse grupo continua com publicações e a questão de cinco dias atrás foi aceita para publicação sobre ácido fólico.

249
00:32:42,480 --> 00:32:46,720
E tivemos também uma surpresa enorme.

250
00:32:47,140 --> 00:32:59,779
O ácido fólico, depois do enriquecimento da farinha com ácido fólico, a incidência na população de carência de folato em São Paulo chega a 2,5%.

251
00:33:01,160 --> 00:33:12,779
E pasmem, em 50 mil exames pedidos num período de anos, nós vimos que a incidência de carência de folato dentro do hospital em pacientes internados

252
00:33:13,730 --> 00:33:16,560
era menor que da população geral.

253
00:33:17,260 --> 00:33:21,340
Ou seja, 50 mil exames jogados fora.

254
00:33:22,220 --> 00:33:27,360
Estamos estudando também, com resultados bem interessantes, ainda não publicados,

255
00:33:27,960 --> 00:33:36,520
diferença de coleta de eletrólitos e de analitos de sangue arterial e venoso.

256
00:33:36,770 --> 00:33:40,420
E tem bons resultados já para mostrarmos.

257
00:33:40,660 --> 00:33:48,760
Estamos estudando também painel respiratório de fazer 4 vírus versus 23 vírus.

258
00:33:49,480 --> 00:33:58,460
Estamos estudando o screening de hepatite, se temos que pedir todos os analitos da hepatite B

259
00:33:58,720 --> 00:34:04,720
ou se é suficiente pedir a GHBS, anti-HBS ou eventualmente anti-HBC.

260
00:34:05,260 --> 00:34:11,580
Ou seja, o grupo continua estudando temas polêmicos.

261
00:34:12,460 --> 00:34:24,200
E eu acho que muita gente não tem ideia de quão polêmicos e de quanto a gente pode melhorar a nossa medicina,

262
00:34:24,480 --> 00:34:31,820
se a gente não economia, mas sim fazermos uma boa prática médica.

263
00:34:32,340 --> 00:34:43,600
E esse grupo foi agraciado com o prêmio de melhor iniciativa de todo o Hospital das Clínicas, o que muito nos orgulha.

264
00:34:44,389 --> 00:34:51,840
E espero que vocês possam usar alguma dessas informações no seu dia a dia.

265
00:34:52,360 --> 00:34:58,560
Estou à disposição, esse é meu e-mail e muito obrigado pela paciência.

266
00:35:27,720 --> 00:35:27,740
Продолжение следует...

`;

   const srtParts = originalSrt.split("\n\n");

   const chunksOf50: string[][] = [];

   for (let i = 0; i < srtParts.length; i += 50) {
      chunksOf50.push(srtParts.slice(i, i + 50));
   }

   const joinedChunksOf50 = chunksOf50.map((chunk) => chunk.join("\n\n"));

   // Translate each chunk using OpenAI
   const translatedChunks = await Promise.all(
      joinedChunksOf50.map(async (chunk, index) => {
         console.log(
            `Translating chunk ${index + 1} of ${joinedChunksOf50.length}`,
         );
         const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
               {
                  role: "system",
                  content:
                     'Act as a a professional translator\n\nYour task is to translate the following srt file to spanish\n\nIt\'s important to take into consideration that this is a transcription of a conference for a medicine congress, so the person may use medical and technical terms, please take this into consideration and translate the transcription as accurately as possible\n\nYou must only respond with the translated srt output\n\nImportant: It is extremely important to respect the times and the format of the original srt file DO NOT change them, you must use the exact same time markers that exist on the file (like "1\n00:00:03,360 --> 00:00:07,100" , "2\n00:00:07,900 --> 00:00:12,060" and so on) and  just translate the texts below them\n\nNEVER change the time markers',
               },
               {
                  role: "user",
                  content: chunk,
               },
            ],
            temperature: 0.3,
         });

         console.log(
            `Translated chunk ${index + 1} of ${joinedChunksOf50.length}`,
         );
         return completion.choices[0].message.content || "";
      }),
   );

   // Combine all translated chunks
   const translatedSrt = translatedChunks.join("\n\n");

   return new NextResponse(translatedSrt, {
      headers: {
         "Content-Type": "text/plain; charset=utf-8",
         "Content-Disposition": 'attachment; filename="translated.srt"',
      },
   });
}
