AKT.bulk.statements = `
s1#att_value(part(asase_tuntum,abuo),presence,negative)#18#none
s2#att_value(part(asase_kokoo,abuo),presence,erratic)#18#none
s3#att_value(part(soil,etwre),presence,positive)#18#none
s4#not(att_value(nyanya,type,nwura_bone))#18#none
s5#att_value(nyanya,appearance,first) if att_value(fallow,length,long)#18#none
s6#att_value(process(nyanya,death),time,first) if att_value(ananse_treumu_huma,presence,positive) or att_value(acheampong,presence,positive)#18#none
s7#att_value(process(part(acheampong,seed),germination),time,short)#18#none
s8#att_value(process(part(acheampong,seed),dispersal),mechanism,air)#22,19,9,3#none
s9#att_value(adedenyaa,type,nwura_bone)#4#none
s10#att_value(action(uprooting,adedenyaa),ease,high)#20,4#none
s11#att_value(process(aya,reproduction),rate,high)#9#none
s12#att_value(action(use,roundup,esre),effectiveness,high)#9#none
s13#att_value(action(use,roundup,nkyenkyema),effectiveness,high)#9#none
s14#att_value(action(uprooting,nantwri_sre),ease,low)#3#none
s15#att_value(action(clearing,nsohwea),ease,high)#17,3#none
s16#att_value(action(clearing,nsasun),ease,high)#5#none
s17#att_value(process(onyina,shading,cocoa),quality,high)#6,5,1#none
s18#att_value(process(akata,shading,cocoa),quality,high)#5#none
s19#att_value(process(plantain,shading,cocoa),quality,high)#5#none
s20#att_value(process(nsohwea,growth),rate,high)#6#none
s21#att_value(process(esa,shading,cocoa),quality,high)#6#none
s22#att_value(process(odoma_fufu,shading,cocoa),quality,high)#6#none
s23#att_value(process(wawa,shading,cocoa),quality,high)#6#none
s24#att_value(process(pepediawuo,shading,cocoa),quality,high)#6#none
s25#att_value(process(opam,shading,cocoa),quality,high)#6#none
s26#att_value(process(nnan_furo,shading,cocoa),quality,low)#10,6#none
s27#att_value(action(clearing,tweta),ease,low)#6#none
s28#att_value(process(odum,shading,cocoa),quality,high)#6#none
s29#att_value(process(nsohwea,dispersal),rate,low)#19#none
s30#att_value(action(clearing,acheampong),ease,low)#21#none
s31#att_value(process(wama,shading,cocoa),quality,high)#1#none
s32#asase_shesheeshe causes1way att_value(soil,fertility,asa)#14#none
s33#att_value(process(part(acheampong,stump),sprouting),density,high) causes1way att_value(part(acheampong,stump_sprouts),density,increase)#22,4#none
s34#att_value(part(nyanya,seed),presence,in_soil) causes1way att_value(nyanya,appearance,first) if action(clearing,nfofoa_kwae)#22,18#none
s35#att_value(weeds,density,increase) causes2way att_value(crop,yield,decrease)#16,22,19,3#none
s36#att_value(process(rainfall),quantity,increase) causes2way att_value(crop,yield,increase)#16#none
s37#att_value(process(rainfall),quantity,low) causes1way att_value(crop,yield,decrease)#16#none
s38#att_value(process(rainfall),occurance,erratic) causes1way att_value(crop,yield,decrease)#16#none
s39#att_value(soil,fertility,decrease) causes2way att_value(weeds,density,increase)#16,22#none
s40#att_value(trees,density,decrease) causes2way att_value(soil,fertility,decrease)#16#none
s41#att_value(fallow,length,decrease) causes2way att_value(trees,density,decrease)#16#none
s42#att_value(trees,density,decrease) causes1way att_value(process(rainfall),occurance,erratic)#16#none
s43#att_value(ateche,moisture,waterlogged) causes1way att_value(soil,cocoa_suitability,negative) if att_value(year,season,rainy)#19,18,10,5#none
s44#att_value(ateche,moisture,dry) causes1way att_value(soil,cocoa_suitability,negative) if att_value(year,season,harmattan)#19,18,10,5#none
s45#att_value(afonywie,temperature,hot) causes1way att_value(soil,cocoa_suitability,negative) if att_value(year,season,harmattan)#18,13,12,11#none
s46#att_value(part(asase_kokoo,abuo),presence,positive) causes1way att_value(soil,cocoa_suitability,positive)#18,13,12,11#none
s47#att_value(part(asase_kokoo,abuo),presence,negative) causes1way att_value(soil,cocoa_suitability,positive)#18,13#none
s48#att_value(part(asase_kokoo,etwre),presence,positive) causes1way att_value(soil,cocoa_suitability,negative)#18,13,12,11,10#none
s49#att_value(part(soil,boulder),presence,positive) causes1way att_value(soil,cocoa_suitability,positive)#18#none
s50#att_value(soil,fertility,high) causes1way att_value(crop,lifespan,long)#18#none
s51#att_value(soil,fertility,high) causes1way att_value(cocoa,maturity,3 years)#18#none
s52#att_value(fallow,length,increase) causes2way att_value(process(rice,growth),rate,increase)#18#none
s53#att_value(soil,fertility,high) causes1way att_value(plantain,cropping_period,10 years) if att_value(asase_kokoo,presence,positive)#18#none
s54#att_value(soil,fertility,depleted) causes1way att_value(plantain,cropping_period,3 years) if att_value(asase_kokoo,presence,positive)#18#none
s55#att_value(fallow,length,short) causes1way att_value(soil,fertility,decrease)#18#none
s56#att_value(fallow,length,decrease) causes2way att_value(soil_pest,density,increase)#18#none
s57#soil_pest causes1way att_value(crop,yield,decrease)#18#none
s58#att_value(fallow,length,long) causes1way att_value(soil_pest,presence,absent)#18#none
s59#att_value(fallow,length,range(5 years,10 years)) causes1way att_value(nfofoa_kwae,presence,positive)#18,13#none
s60#att_value(fallow,length,>1 year) causes1way att_value(part(esre,seed),density,decrease)#20,18,5#none
s61#att_value(fallow,length,5 years) causes1way att_value(acheampong,density,decrease) if att_value(asase_kokoo,presence,positive)#20,18,13#none
s62#att_value(fallow,length,5 years) causes1way att_value(crop,cropping_period,2 years) if att_value(asase_kokoo,presence,positive)#18#none
s63#att_value(fallow,length,range(8 years,10 years)) causes1way att_value(crop,cropping_period,range(4 years,5 years)) if att_value(asase_kokoo,presence,positive)#18#none
s64#att_value(soil,fertility,high) causes1way att_value(part(cassava,tuber),size,fat)#19,18#none
s65#att_value(soil,fertility,depleted) causes1way att_value(part(cassava,tuber),size,thin)#18#none
s66#att_value(fallow,length,5 years) causes1way att_value(earthworm,density,high)#18#none
s67#att_value(earthworm,density,increase) causes2way att_value(soil,fertility,increase)#18,10#none
s68#att_value(fallow,length,range(8 years,10 years)) causes1way att_value(process(undergrowth,death),proportion,100%)#18#none
s69#att_value(process(undergrowth,death),proportion,100%) causes1way process(undergrowth,decomposition)#18#none
s70#process(undergrowth,decomposition) causes1way process(soil,development,black_layer)#18,9#none
s71#att_value(fallow,length,range(8 years,10 years)) causes1way att_value(black_layer,depth,15cm)#18#none
s72#att_value(undergrowth,presence,negative) causes1way att_value(black_layer,presence,positive)#18#none
s73#att_value(fallow,length,range(15 years,20 years)) causes1way att_value(soil,fertility,high) if att_value(afonywie,presence,positive)#18#none
s74#afonywie causes1way att_value(trees,density,low)#18#none
s75#afonywie causes1way att_value(esre,density,high)#22,18,17#none
s76#afonywie causes1way att_value(acheampong,density,low)#18#none
s77#att_value(trees,density,low) causes1way att_value(process(trees,sprouting,root),time,5 years)#18#none
s78#att_value(process(trees,sprouting,root),time,5 years) causes1way att_value(process(trees,shading,undergrowth),time,range(15 years,20 years))#18#none
s79#process(trees,shading,undergrowth) causes1way att_value(undergrowth,presence,negative)#18,13,6#none
s80#asase_kokoo causes1way att_value(trees,density,high)#18#none
s81#asase_tuntum causes1way att_value(trees,density,high)#18#none
s82#att_value(trees,density,high) causes1way att_value(process(trees,sprouting,root),time,decrease)#18#none
s83#att_value(process(trees,sprouting,root),time,short) causes1way att_value(process(trees,shading,undergrowth),time,range(5 years,10 years))#19,18#none
s84#att_value(fallow,length,range(5 years,10 years)) causes1way att_value(soil,fertility,high) if att_value(asase_kokoo,presence,positive) or att_value(asase_tuntum,presence,positive)#20,18#none
s85#att_value(fallow,length,6 years) causes1way att_value(soil,fertility,high) if att_value(ateche,presence,positive)#18#none
s86#ateche causes1way att_value(sante,presence,positive)#18#none
s87#ateche causes1way att_value(gyama,presence,positive)#18#none
s88#afonywie causes1way att_value(gyama,presence,positive)#18#none
s89#afonywie causes1way att_value(onyina,presence,positive)#18#none
s90#afonywie causes1way att_value(watapuo,presence,positive)#18#none
s91#att_value(ateche,cropping_period,4 years) causes1way att_value(soil,fertility,depleted) if att_value(cassava_mix,presence,positive)#18#none
s92#att_value(asase_kokoo,cropping_period,6 years) causes1way att_value(soil,fertility,depleted) if att_value(cassava_mix,presence,positive)#18#none
s93#att_value(asase_tuntum,cropping_period,6 years) causes1way att_value(soil,fertility,depleted) if att_value(cassava_mix,presence,positive)#18#none
s94#not(asase_enyine) causes1way att_value(soil,moisture,low)#18#none
s95#att_value(afonywie,cropping_period,3 years) causes1way att_value(soil,fertility,depleted) if att_value(cassava_mix,presence,positive)#18#none
s96#att_value(trees,density,low) causes1way att_value(afonywie,temperature,hot)#18,12,11#none
s97#att_value(soil,temperature,increase) causes2way att_value(earthworm,density,decrease)#18#none
s98#action(cutting,sprouting_tree) causes1way att_value(process(trees,growth),rate,decrease)#18#none
s99#att_value(process(trees,growth),rate,decrease) causes2way att_value(esre,density,increase)#18,17#none
s100#att_value(soil,fertility,high) causes1way att_value(nyanya,presence,positive)#22,18,6#none
s101#action(clearing,kwae) causes1way process(nfofoa_kwae,development) if att_value(fallow,length,long)#18#none
s102#att_value(acheampong,density,increase) causes1way att_value(ananse_treumu_huma,density,decrease)#18#none
s103#att_value(year,season,harmattan) causes1way att_value(soil,moisture,low)#18#none
s104#att_value(soil,moisture,low) causes1way process(nyanya,death)#18#none
s105#att_value(soil,moisture,low) causes1way not(process(acheampong,death))#18#none
s106#att_value(soil,moisture,low) causes1way not(process(ananse_treumu_huma,death))#18#none
s107#att_value(process(acheampong,development,fallow),time,3 years) causes1way att_value(soil,fertility,increase)#18,12,11,10#none
s108#att_value(process(acheampong,development,fallow),time,3 years) causes1way att_value(soil,fertility_loss,1.5 years)#18#none
s109#att_value(nfofoa_kwae,presence,positive) causes1way att_value(process(trees,shading,weeds),intensity,increase)#18#none
s110#att_value(process(trees,shading,weeds),intensity,increase) causes2way att_value(weeds,density,decrease)#19,18,6#none
s111#process(esre,development,fallow) causes1way att_value(soil,fertility,decrease)#18#none
s112#att_value(process(part(acheampong,seedling),survival),density,low) causes1way att_value(part(acheampong,stem),density,low)#18,6#none
s113#att_value(part(acheampong,stem),density,low) causes1way att_value(action(clearing,acheampong),ease,high)#20,18,6#none
s114#att_value(process(part(esre,seedling),survival),density,high) causes1way att_value(part(esre,stem),density,high)#18#none
s115#att_value(part(esre,stem),density,high) causes1way att_value(action(clearing,esre),ease,low)#18#none
s116#att_value(process(part(esre,seed),dispersal),mechanism,air) causes1way att_value(process(esre,colonisation),rate,increase)#18,12,11,9#none
s117#att_value(process(part(esre,seed),dispersal),mechanism,bird) causes1way att_value(process(esre,colonisation),rate,increase)#18,12,11#none
s118#att_value(process(part(esre,seed),dispersal),mechanism,timber_machinery) causes1way att_value(process(esre,colonisation),rate,increase)#18,12,11,9#none
s119#att_value(adjoguo,stage,beginning) causes1way not(action(clearing,weeds))#18#none
s120#att_value(soil,fertility,decrease) causes1way att_value(adjoguo,stage,beginning)#18#none
s121#att_value(adjoguo,stage,beginning) causes1way not(action(cutting,trees))#18#none
s122#att_value(adjoguo,stage,beginning) causes1way att_value(action(harvesting,plantain),presence,positive)#18#none
s123#att_value(adjoguo,stage,beginning) causes1way att_value(action(harvesting,cassava),presence,positive)#18#none
s124#not(action(cutting,trees)) causes1way att_value(process(trees,shading,undergrowth),time,decrease)#18#none
s125#action(use,herbicide) causes1way att_value(process(weeds,death),proportion,100%)#22#none
s126#att_value(process(part(esre,stump),sprouting),rate,high) causes1way att_value(action(clearing,esre),intensity,increase)#22#none
s127#att_value(process(part(esre,root),sprouting),rate,high) causes1way action(burning,esre) if action(uprooting,esre)#23,22,1#none
s128#att_value(weeds,age,young) causes1way att_value(part(weeds,root),density,low)#22#none
s129#att_value(part(weeds,root),density,low) causes1way att_value(action(clearing,weeds),ease,high)#22#none
s130#att_value(soil,fertility,decrease) causes2way att_value(esre,density,increase)#22#none
s131#att_value(soil,fertility,decrease) causes2way att_value(acheampong,density,increase)#22#none
s132#att_value(process(trees,shading,esre),tolerance,low) causes1way att_value(process(esre,growth),rate,decrease) if att_value(trees,density,increase)#22,1#none
s133#att_value(trees,density,increase) causes2way att_value(soil,moisture,increase)#22#none
s134#att_value(part(pawpaw,seed),presence,in_soil) causes1way att_value(pawpaw,appearance,first) if action(clearing,nfofoa_kwae)#22#none
s135#not(att_value(part(acheampong,seed),presence,in_soil)) causes1way att_value(acheampong,appearance,second) if action(clearing,nfofoa_kwae)#22,21,4#none
s136#not(att_value(part(esre,seed),presence,in_soil)) causes1way att_value(esre,appearance,last) if action(clearing,nfofoa_kwae)#22#none
s137#asase_kokoo causes1way att_value(acheampong,density,average)#22#none
s138#att_value(afonywie,cropping_period,1 year) causes1way att_value(afonywie,fertility,high) if att_value(fallow,length,long)#4#none
s139#att_value(afonywie,fertility,high) causes1way att_value(soil,cocoa_suitability,high)#4#none
s140#att_value(afonywie,cropping_period,1 year) causes1way att_value(process(crop,shading,cocoa),intensity,high)#4#none
s141#att_value(process(crop,shading,cocoa),intensity,high) causes1way att_value(soil,cocoa_suitability,high)#4#none
s142#att_value(afonywie,cropping_period,range(2 years,3 years)) causes1way att_value(afonywie,fertility,low) if att_value(fallow,length,long)#4#none
s143#att_value(afonywie,fertility,low) causes1way att_value(soil,cocoa_suitability,low)#5,4#none
s144#att_value(afonywie,cropping_period,range(2 years,3 years)) causes1way att_value(process(crop,shading,cocoa),intensity,decrease)#4#none
s145#att_value(process(crop,shading,cocoa),intensity,low) causes1way att_value(afonywie,temperature,hot)#4#none
s146#att_value(process(rain,infiltration),rate,increase) causes1way att_value(process(undergrowth,decomposition),rate,increase)#4#none
s147#att_value(process(rain,runoff),rate,increase) causes2way att_value(process(rain,infiltration),rate,decrease)#4#none
s148#att_value(vegetation_debris,presence,increase) causes2way att_value(process(rain,runoff),rate,decrease)#4#none
s149#att_value(process(rain,runoff),rate,increase) causes1way att_value(process(topsoil,erosion),rate,increase)#4#none
s150#action(burning,vegetation_debris) causes1way att_value(vegetation_debris,presence,decrease)#23,20,19,17,13,12,11,10,7,6,5,4,3,1#none
s151#att_value(vegetation_debris,presence,decrease) causes2way att_value(action(work,crop),ease,increase)#23,20,19,17,13,12,11,10,7,6,5,4,3,1#none
s152#action(burning,vegetation_debris) causes1way att_value(ash,presence,increase)#23,19,12,11,6,4,3#none
s153#att_value(ash,presence,increase) causes1way att_value(soil,fertility,increase)#23,19,12,11,10,6,4,3#none
s154#action(burning,nfofoa_kwae) causes1way att_value(action(burning,vegetation_debris),intensity,increase) if att_value(process(rainfall),presence,low)#4#none
s155#att_value(action(burning,vegetation_debris),intensity,increase) causes2way att_value(vegetation_debris,density,decrease)#17,12,11,4#none
s156#action(burning,nfofoa_kwae) causes1way att_value(part(trees,log),presence,positive)#4#none
s157#att_value(part(trees,log),presence,positive) causes1way att_value(process(rain,runoff),rate,decrease)#4#none
s158#action(burning,vegetation_debris) causes1way att_value(soil,fertility,loss)#4,1#none
s159#att_value(action(burning,vegetation_debris),heat,high) causes1way att_value(soil,moisture,loss)#4#none
s160#process(part(trees,log),decomposition) causes1way att_value(soil,fertility,increase)#13,12,11,10,4#none
s161#att_value(process(adedenyaa,germination),time,1 week) causes1way att_value(action(clearing,adedenyaa),ease,low) if action(burning,land)#4#none
s162#att_value(process(adedenyaa,growth),rate,high) causes1way att_value(action(clearing,adedenyaa),ease,low)#4#none
s163#att_value(process(adedenyaa,growth),rate,high) causes1way att_value(process(adedenyaa,shading,crop),intensity,increase)#4#none
s164#att_value(process(adedenyaa,shading,crop),intensity,increase) causes2way att_value(process(crop,growth),rate,decrease)#4#none
s165#att_value(process(crop,growth),rate,decrease) causes1way att_value(crop,yield,decrease)#4#none
s166#att_value(process(adedenyaa,flowering),time,3 weeks) causes1way att_value(process(adedenyaa,seed_set),time,4 weeks)#4#none
s167#att_value(process(adedenyaa,seed_set),time,4 weeks) causes1way att_value(process(adedenyaa,reproduction),rate,high)#4#none
s168#att_value(process(adedenyaa,reproduction),time,high) causes1way att_value(action(clearing,adedenyaa),ease,low)#4#none
s169#att_value(process(nkyenkyema,growth),pattern,grouped) causes1way att_value(action(clearing,nkyenkyema),ease,high)#4#none
s170#att_value(part(nkyenkyema,stem),texture,spiny) causes1way att_value(action(clearing,nkyenkyema),ease,low) if att_value(action(clearing,nkyenkyema),method,hand)#4#none
s171#att_value(process(part(acheampong,seedling),shading,part(acheampong,seedling)),intensity,high) causes1way att_value(process(part(acheampong,seedling),survival),density,low)#6,4#none
s172#att_value(process(part(acheampong,seed),germination),rate,high) causes1way att_value(process(part(acheampong,seedling),shading,part(acheampong,seedling)),intensity,increase)#4#none
s173#att_value(process(acheampong,growth),rate,high) causes1way att_value(process(part(acheampong,seedling),shading,part(acheampong,seedling)),intensity,increase)#4#none
s174#att_value(part(acheampong,stump_sprouts),toughness,low) causes1way att_value(action(clearing,acheampong),ease,high)#4#none
s175#att_value(part(acheampong,seedling),toughness,low) causes1way att_value(action(clearing,acheampong),ease,high)#4#none
s176#not(att_value(process(acheampong,growth),pattern,grouped)) causes1way att_value(process(crop,growth),tolerance,high) if not(att_value(acheampong,density,high))#4#none
s177#att_value(weeds,type,nwura_bone) causes1way att_value(process(weeds,germination),time,after_burn) if action(burning,vegetation_debris)#4#none
s178#att_value(process(weeds,germination),time,after_burn) causes1way att_value(process(weeds,growth),rate,increase)#4#none
s179#action(clearing,fallow) causes1way att_value(part(weeds,seed),presence,high) if not(att_value(fallow,length,>5 years))#4,1#none
s180#att_value(part(weeds,seed),density,high) causes1way att_value(process(weeds,germination),density,high) if att_value(process(part(weeds,seed),germination),flush,first)#9,4#none
s181#att_value(process(part(weeds,seed),germination),flush,second) causes1way att_value(process(weeds,germination),density,decrease)#4#none
s182#att_value(process(part(weeds,seed),germination),flush,second) causes1way att_value(crop,height,high) if att_value(soil,fertility,high)#4#none
s183#att_value(crop,height,high) causes1way att_value(process(crop,shading,weeds),intensity,increase)#19,4#none
s184#att_value(process(crop,shading,weeds),intensity,increase) causes2way att_value(process(weeds,growth),rate,decrease)#23,19,4#none
s185#att_value(action(clearing,fallow),season,harmattan) causes1way att_value(process(weeds,germination),density,decrease)#4#none
s186#att_value(action(clearing,fallow),season,harmattan) causes1way att_value(process(part(weeds,stump),sprouting),density,low)#4#none
s187#att_value(action(clearing,fallow),season,rainy) causes1way att_value(process(weeds,germination),density,increase)#4#none
s188#att_value(action(clearing,fallow),season,rainy) causes1way att_value(process(part(weeds,stump),sprouting),density,high)#4#none
s189#att_value(action(planting,cassava),season,harmattan) causes1way att_value(process(cassava,growth),rate,high) if att_value(year,season,rainy)#4#none
s190#att_value(process(cassava,growth),rate,high) causes1way att_value(crop,height,high)#4#none
s191#att_value(process(weeds,competition,crop),resource,nutrient) causes1way att_value(crop,yield,decrease)#4#none
s192#ateche causes1way att_value(esre,density,high) if att_value(farm,position,near_river)#12,11,4#none
s193#ateche causes1way att_value(rice,density,high) if att_value(farm,position,near_river)#4#none
s194#att_value(esre,density,high) causes1way att_value(rice,yield,decrease)#4#none
s195#action(use,herbicide) causes1way att_value(vegetation_debris,density,increase)#4#none
s196#odoma causes1way att_value(soil,moisture,increase)#9,1#none
s197#att_value(soil,moisture,increase) causes1way att_value(shade_tree,quality,high)#9#none
s198#okoro causes1way att_value(soil,moisture,decrease)#9#none
s199#domini causes1way att_value(soil,moisture,increase)#9#none
s200#esa causes1way att_value(soil,moisture,decrease)#9#none
s201#fumtum causes1way att_value(soil,moisture,decrease)#9#none
s202#acheampong causes1way att_value(soil,moisture,decrease)#9#none
s203#att_value(soil,moisture,decrease) causes1way process(crop,death)#9#none
s204#action(use,herbicide) causes1way not(process(bosomwuajura,death))#9#none
s205#not(process(bosomwuajura,death)) causes1way att_value(action(clearing,bosomwuajura),ease,low)#20,9#none
s206#action(use,roundup) causes1way not(process(bosomwuajura,death))#9#none
s207#action(uprooting,bosomwuajura) causes1way process(bosomwuajura,sprouting)#9#none
s208#process(bosomwuajura,sprouting) causes1way not(process(bosomwuajura,death))#9#none
s209#att_value(action(uprooting,bosomwuajura),ease,low) causes1way att_value(action(clearing,bosomwuajura),ease,low)#9#none
s210#att_value(process(part(weeds,seed),dispersal),mechanism,timber_machinery) causes1way att_value(process(weeds,colonisation),rate,increase)#9,6#none
s211#att_value(process(part(weeds,seed),dispersal),mechanism,clothing) causes1way att_value(process(weeds,colonisation),rate,increase)#12,11,9#none
s212#att_value(weeds,height,30cm) causes1way att_value(action(use,herbicide,weeds),effectiveness,high)#20,19,9#none
s213#att_value(process(esre,sprouting),stage,young) causes1way att_value(action(use,herbicide,esre),effectiveness,high)#12,11,9#none
s214#att_value(weeds,height,60cm) causes1way att_value(action(use,herbicide,weeds),effectiveness,low)#19,9#none
s215#att_value(action(use,herbicide,weeds),season,harmattan) causes1way att_value(action(use,herbicide,weeds),effectiveness,low)#9#none
s216#att_value(action(use,herbicide,weeds),season,rainy) causes1way att_value(action(use,herbicide,weeds),effectiveness,high)#9#none
s217#att_value(process(part(sansan,node),rooting),density,high) causes1way att_value(action(clearing,sansan),ease,low)#14#none
s218#process(ananse_treumu_huma,coiling,rice) causes1way att_value(action(clearing,ananse_treumu_huma),ease,low)#14#none
s219#action(use,herbicide,ananse_treumu_huma) causes1way att_value(action(clearing,ananse_treumu_huma),ease,high)#14#none
s220#action(planting,rice,ateche) causes1way att_value(process(rice,tillering),density,increase)#14#none
s221#action(burning,vegetation_debris) causes1way att_value(part(soil,surface),hardness,increase)#14#none
s222#att_value(part(soil,surface),hardness,increase) causes2way att_value(process(crop,growth),rate,decrease)#14#none
s223#att_value(afonywie,shesheeshe,positive) causes1way att_value(afonywie,fertility,low)#23,14#none
s224#afonywie causes1way att_value(weeds,height,decrease)#14#none
s225#asase_kokoo causes1way att_value(weeds,height,increase)#14#none
s226#att_value(afonywie,cropping_period,increase) causes1way att_value(afonywie,shesheeshe,increase)#14#none
s227#att_value(afonywie,shesheeshe,increase) causes2way att_value(crop,yield,decrease)#14#none
s228#att_value(trees,density,decrease) causes2way att_value(wind,speed,increase)#14,10#none
s229#att_value(trees,density,increase) causes2way att_value(soil,enyunu,increase)#23,14,13,12,11,10#none
s230#att_value(soil,enyunu,increase) causes1way att_value(crop,yield,increase)#14#none
s231#action(planting,oil_palm,afonywie) causes1way att_value(process(oil_palm,growth),rate,average)#23,3#none
s232#att_value(afonywie,water_holding_capacity,low) causes1way att_value(afonywie,moisture,low)#3#none
s233#att_value(asase_kokoo,water_holding_capacity,high) causes1way att_value(asase_kokoo,moisture,high)#3#none
s234#att_value(farm,position,near_river) causes1way att_value(nantwri_sre,density,high)#4#none
s235#att_value(trees,density,low) causes1way att_value(afonywie,cocoa_suitability,high)#10,3#none
s236#att_value(soil,moisture,dry) causes1way process(nkyenkyema,death)#3#none
s237#att_value(soil,fertility,increase) causes1way att_value(process(weeds,growth),rate,increase)#3#none
s238#att_value(part(trees,root),length,deep) causes1way process(water,transfer,part(soil,surface))#3#none
s239#process(vegetation_debris,decomposition) causes1way att_value(soil,fertility,increase)#13,7,6,5#none
s240#process(onyina,decomposition) causes1way att_value(process(crop,growth),rate,increase)#17,10,5#none
s241#trees causes1way att_value(process(ncranpan,dispersal),mechanism,bird)#5#none
s242#att_value(process(trees,shading,cocoa),intensity,increase) causes2way att_value(cocoa,yield,decrease)#5#none
s243#process(trees,shading,cocoa) causes1way att_value(cocoa,yield,decrease) if att_value(cocoa,stage,mature)#5#none
s244#att_value(soil,fertility,high) causes1way att_value(nsasun,presence,positive)#6,5#none
s245#att_value(soil,fertility,high) causes1way att_value(atooto,presence,positive)#6,5#none
s246#process(nsohwea,coiling,cocoa) causes1way process(cocoa,death)#6#none
s247#att_value(process(part(nsohwea,node),rooting),density,high) causes1way att_value(action(clearing,nsohwea),ease,low)#19,6#none
s248#action(burning,vegetation_debris) causes1way process(part(cocoyam,corm),germination)#21,6#none
s249#action(burning,vegetation_debris) causes1way process(part(ananse_treumu_huma,seed),germination)#6,1#none
s250#att_value(part(ananse_dukono,root),position,central) causes1way att_value(action(clearing,ananse_dukono),ease,high)#6#none
s251#att_value(soil,fertility,high) causes1way att_value(ananse_dukono,presence,positive)#6#none
s252#att_value(soil,fertility,high) causes1way att_value(mumuanka,presence,positive)#6#none
s253#odoma_kokoo causes1way att_value(soil,moisture,decrease)#6#none
s254#nyankyereni causes1way att_value(soil,moisture,decrease)#6#none
s255#process(part(wawa,branch),drop) causes1way process(cocoa,death)#6#none
s256#att_value(shade_tree,height,high) causes1way att_value(part(cocoa,canopy),height,below)#6#none
s257#att_value(part(cocoa,canopy),height,below) causes1way process(wind,infiltration)#6#none
s258#att_value(part(cocoa,canopy),height,below) causes1way process(sunlight,infiltration)#6#none
s259#att_value(part(shade_tree,crown),size,narrow) causes1way process(sunlight,infiltration)#6#none
s260#att_value(process(shade_tree,competition,cocoa),resource,soil_moisture) causes1way att_value(cocoa,yield,decrease)#6#none
s261#kokoanisua causes1way att_value(soil,moisture,increase)#10,2#none
s262#att_value(process(acheampong,growth),rate,high) causes1way att_value(process(part(acheampong,seedling),shading,crop),intensity,increase)#20,3#none
s263#att_value(process(part(acheampong,seedling),shading,crop),intensity,increase) causes2way att_value(process(crop,growth),rate,decrease)#20,3#none
s264#att_value(process(trees,shading,acheampong),tolerance,low) causes1way att_value(acheampong,density,decrease) if att_value(process(trees,shading),intensity,high)#19,5,3#none
s265#att_value(part(acheampong,seed),presence,nearby) causes1way att_value(process(acheampong,colonisation),rate,increase)#19,3#none
s266#att_value(process(rainfall),time,first) causes1way process(part(acheampong,seed),germination)#3#none
s267#process(weeds,decomposition) causes1way att_value(soil,fertility,increase)#3#none
s268#att_value(oil_palm,age,mature) causes1way att_value(process(oil_palm,shading,weeds),intensity,increase)#3#none
s269#att_value(process(oil_palm,shading,weeds),intensity,high) causes1way att_value(process(weeds,growth),rate,decrease)#3#none
s270#att_value(fallow,length,1 year) causes1way att_value(process(weeds,growth),rate,increase)#3,1#none
s271#att_value(process(weeds,growth),rate,increase) causes2way att_value(crop,yield,decrease)#19,3#none
s272#att_value(fallow,length,increase) causes2way att_value(weeds,strength,decrease)#3,1#none
s273#att_value(fallow,stage,mature) causes1way att_value(action(clearing,weeds),frequency,2)#13,3#none
s274#not(att_value(fallow,stage,mature)) causes1way att_value(action(clearing,weeds),frequency,range(3,4))#3,1#none
s275#att_value(action(burning,vegetation_debris),intensity,increase) causes1way att_value(process(part(weeds,stump),sprouting),time,long)#23,20,17,3#none
s276#att_value(fallow,length,2 years) causes1way att_value(crop,yield,average) if att_value(asase_kokoo,presence,positive)#3#none
s277#att_value(soil,moisture,high) causes1way att_value(soil,cocoa_suitability,high)#5#none
s278#action(burning,vegetation_debris) causes1way att_value(crop,yield,decrease) if att_value(process(rainfall),quantity,low)#5#none
s279#att_value(fallow,stage,mature) causes1way att_value(soil,fertility,high)#21,6,5#none
s280#att_value(nfofoa_kwae,presence,positive) causes1way att_value(fallow,stage,mature)#18,6,5#none
s281#process(part(onyina,log),decomposition) causes1way att_value(soil,fertility,increase)#17,10,5#none
s282#process(part(trees,leaves),decomposition) causes1way att_value(soil,fertility,increase)#19,13,12,11,10,6,5#none
s283#att_value(fallow,length,3 years) causes1way att_value(crop,yield,average)#6,5#none
s284#att_value(trees,density,increase) causes2way att_value(process(trees,shading,cocoa),intensity,increase)#5#none
s285#att_value(fallow,stage,mature) causes1way att_value(weeds,density,decrease)#13,5#none
s286#process(acheampong,decomposition) causes1way att_value(process(crop,growth),rate,increase)#6#none
s287#att_value(action(clearing,weeds),frequency,2) causes1way att_value(weeds,density,high) if att_value(year,time,subsequent)#6#none
s288#att_value(action(clearing,weeds),frequency,3) causes1way att_value(weeds,density,average) if att_value(year,time,subsequent)#6#none
s289#process(rainfall) causes1way att_value(afonywie,texture,soft)#12,11#none
s290#process(rainfall) causes1way att_value(ateche,texture,sticky)#12,11#none
s291#att_value(process(rainfall),quantity,high) causes1way att_value(asase_kokoo,texture,soft)#12,11#none
s292#part(oil_palm,root) causes1way att_value(soil,moisture,increase)#12,11#none
s293#att_value(soil,moisture,decrease) causes1way not(process(afonywie,drying,oil_palm))#12,11#none
s294#part(cocoa,root) causes1way att_value(soil,moisture,decrease)#12,11#none
s295#process(rain,infiltration,soil) causes1way process(part(ash,nutrients),infiltration,soil)#19,12,11#none
s296#process(part(ash,nutrients),infiltration,soil) causes1way att_value(soil,fertility,increase)#19,12,11#none
s297#not(action(burning,vegetation_debris)) causes1way att_value(process(weeds,sprouting),time,short)#23,21,17,12,11#none
s298#action(burning,vegetation_debris) causes1way process(soil,heating)#12,11#none
s299#process(soil,heating) causes1way process(part(soil,surface),loosening)#12,11#none
s300#process(part(soil,surface),loosening) causes1way att_value(process(crop,growth),rate,increase)#12,11#none
s301#action(burning,vegetation_debris) causes1way att_value(process(crop,germination),time,before_weed)#12,11#none
s302#att_value(soil,fertility,increase) causes1way att_value(process(crop,growth),rate,increase)#18,12,11,9#none
s303#att_value(process(crop,growth),rate,increase) causes1way att_value(crop,yield,increase)#18,12,11,9#none
s304#att_value(process(acheampong,drying),rate,high) causes1way att_value(action(burning,vegetation_debris),intensity,increase)#12,11#none
s305#action(burning,esre) causes1way process(part(esre,stem),death)#12,11#none
s306#action(burning,esre) causes1way not(process(part(esre,stump),death))#12,11#none
s307#not(process(part(esre,stump),death)) causes1way att_value(process(part(esre,stump),sprouting),rate,high)#12,11#none
s308#att_value(process(part(esre,stump),sprouting),rate,high) causes1way att_value(process(esre,colonisation),rate,increase)#12,11#none
s309#att_value(process(acheampong,shading,esre),intensity,increase) causes2way att_value(process(esre,growth),rate,decrease)#12,11,1#none
s310#asase_kokoo causes1way att_value(sansan,presence,positive)#12,11#none
s311#att_value(process(oil_palm,shading),intensity,low) causes1way att_value(weeds,density,increase)#12,11#none
s312#att_value(process(cocoa,shading),intensity,high) causes1way att_value(weeds,density,decrease)#12,11#none
s313#att_value(process(bosomwuajura,death),age,1 month) causes1way att_value(action(clearing,bosomwuajura),ease,high)#12,11#none
s314#att_value(process(bosomwuajura,growth),height,short) causes1way att_value(process(bosomwuajura,shading,crop),intensity,low)#23,20,12,11#none
s315#att_value(process(part(weeds,seed),dispersal),mechanism,air) causes1way att_value(process(weeds,colonisation),rate,increase)#12,11#none
s316#att_value(process(part(weeds,seed),dispersal),mechanism,bird) causes1way att_value(process(weeds,colonisation),rate,increase)#12,11#none
s317#att_value(process(part(esre,seed),survival),time,<1 year) causes1way process(part(esre,seed),germination) if att_value(action(clearing,fallow),age,1 year)#12,11#none
s318#att_value(process(part(esre,root),sprouting),rate,high) causes1way att_value(process(esre,colonisation),rate,increase)#12,11#none
s319#process(trees,shading,soil) causes1way att_value(soil,enyunu,increase)#23,12,11#none
s320#process(esre,colonisation) causes1way not(process(soil,shading))#12,11#none
s321#process(acheampong,colonisation) causes1way not(process(soil,shading))#12,11#none
s322#kakapenpen causes1way att_value(soil,fertility,increase)#12,11#none
s323#odoma causes1way att_value(soil,fertility,increase)#12,11#none
s324#pepediawuo causes1way att_value(soil,fertility,increase)#12,11#none
s325#att_value(part(watapuo,root),depth,shallow) causes1way att_value(action(work,soil),ease,low)#12,11#none
s326#att_value(part(okoro,root),depth,shallow) causes1way att_value(action(work,soil),ease,low)#12,11#none
s327#att_value(part(genegene,root),depth,shallow) causes1way att_value(action(work,soil),ease,low)#12,11#none
s328#process(part(trees,fruit),decomposition) causes1way att_value(soil,fertility,increase)#12,11#none
s329#foto causes1way att_value(soil,fertility,increase)#12,11#none
s330#process(part(onyina,branch),drop) causes1way process(cocoa,death)#12,11#none
s331#att_value(esre,age,increase) causes2way att_value(action(use,herbicide,esre),effectiveness,decrease)#12,11#none
s332#att_value(wind,speed,increase) causes1way att_value(process(plantain,blow_down),probability,increase)#14,10#none
s333#att_value(trees,density,high) causes1way not(att_value(afonywie,temperature,hot))#10#none
s334#process(part(acheampong,leaves),decomposition) causes1way att_value(soil,fertility,increase)#23,10#none
s335#att_value(soil,fertility,high) causes1way att_value(nkonkoahin,presence,positive)#10#none
s336#att_value(soil,fertility,high) causes1way att_value(part(soil,black_layer),presence,positive)#10#none
s337#att_value(soil,fertility,high) causes1way att_value(soil,enyunu,increase)#10#none
s338#att_value(soil,fertility,high) causes1way att_value(soil,texture,foamy)#13,10#none
s339#att_value(soil,fertility,low) causes1way att_value(fumtum,presence,positive)#10#none
s340#att_value(soil,fertility,low) causes1way att_value(kakapenpen,presence,positive)#10#none
s341#att_value(soil,fertility,low) causes1way att_value(keyja,presence,positive)#10#none
s342#att_value(soil,fertility,low) causes1way att_value(nnan_furo,presence,positive)#10#none
s343#kakapenpen causes1way att_value(soil,moisture,decrease)#10#none
s344#keyja causes1way att_value(soil,moisture,decrease)#10#none
s345#nnan_furo causes1way att_value(soil,moisture,decrease)#10#none
s346#process(part(kumanini,log),decomposition) causes1way att_value(soil,fertility,increase)#10#none
s347#att_value(soil,fertility,high) causes1way att_value(odoma,presence,positive)#10#none
s348#att_value(soil,fertility,high) causes1way att_value(domini,presence,positive)#10#none
s349#att_value(soil,fertility,high) causes1way att_value(kokoanisua,presence,positive)#10#none
s350#process(part(domini,fruit),decomposition) causes1way att_value(soil,fertility,increase)#10#none
s351#process(part(odoma,fruit),decomposition) causes1way att_value(soil,fertility,increase)#10#none
s352#att_value(trees,density,increase) causes2way att_value(cocoa,lifespan,increase)#10#none
s353#att_value(millipede,density,increase) causes1way att_value(soil,fertility,increase)#10#none
s354#action(burning,vegetation_debris) causes1way att_value(millipede,density,decrease)#10#none
s355#action(burning,vegetation_debris) causes1way att_value(earthworm,density,decrease)#10#none
s356#action(work,soil) causes1way att_value(process(soil,erosion),rate,increase)#10#none
s357#att_value(process(soil,erosion),rate,increase) causes1way att_value(etwre,depth,decrease)#10#none
s358#process(sunlight,shining,soil) causes1way att_value(soil,fertility,decrease)#23,13#none
s359#att_value(wind,speed,increase) causes1way att_value(process(part(acheampong,seed),dispersal),effectiveness,increase)#19#none
s360#att_value(part(asase_kokoo,abuo),presence,positive) causes1way att_value(process(cocoa,growth),rate,decrease)#19#none
s361#att_value(part(asase_kokoo,abuo),presence,positive) causes1way att_value(cocoa,yield,high)#19#none
s362#att_value(process(cocoa,growth),rate,decrease) causes1way att_value(cocoa,maturity,delayed)#19#none
s363#action(burning,vegetation_debris) causes1way att_value(soil,fertility,no_change)#19,13#none
s364#att_value(soil,fertility,low) causes1way att_value(soil,texture,hard)#19,18#none
s365#att_value(soil,fertility,low) causes1way att_value(soil,texture,sticky)#19#none
s366#att_value(part(soil,etwre),presence,positive) causes1way att_value(crop,height,decrease)#19#none
s367#att_value(fallow,length,range(7 years,10 years)) causes1way att_value(soil,cocoa_suitability,high) if att_value(asase_kokoo,presence,positive)#19#none
s368#att_value(afonywie,water_holding_capacity,low) causes1way att_value(process(part(afonywie,nutrients),leaching),rate,increase)#19,1#none
s369#att_value(asase_kokoo,water_holding_capacity,high) causes1way att_value(process(part(asase_kokoo,nutrients),leaching),rate,decrease)#19,1#none
s370#att_value(ateche,moisture,dry) causes1way process(ateche,cracking) if att_value(year,season,harmattan)#19#none
s371#process(ateche,cracking) causes1way att_value(soil,cocoa_suitability,negative)#19#none
s372#att_value(nsohwea,height,short) causes1way att_value(process(nsohwea,shading,cocoa),intensity,low)#19#none
s373#nsasun causes1way process(skin,irritation)#21#none
s374#not(action(burning,vegetation_debris)) causes1way att_value(vegetation_debris,density,increase)#21#none
s375#att_value(vegetation_debris,density,increase) causes1way att_value(soil,fertility,increase)#21,17,1#none
s376#att_value(part(nyanya,root),position,central) causes1way att_value(action(clearing,nyanya),ease,high)#21#none
s377#att_value(action(clearing,nyanya),ease,high) causes1way att_value(action(clearing,land),area,increase)#21#none
s378#action(clearing,pawpaw) causes1way att_value(process(pawpaw,colonisation),time,long)#21#none
s379#att_value(part(soil,etwre),presence,positive) causes1way att_value(part(plant,root),length,decrease)#21#none
s380#att_value(part(plant,root),length,decrease) causes1way process(plant,blow_down)#21#none
s381#att_value(part(plant,root),length,decrease) causes1way att_value(process(plant,growth),rate,decrease)#21#none
s382#att_value(process(plant,growth),rate,decrease) causes1way att_value(plant,yield,decrease)#21#none
s383#att_value(soil,fertility,high) causes1way att_value(part(cocoyam,leaves),colour,deep_green)#21#none
s384#action(cutting,trees) causes1way process(soil,shaking)#23,21#none
s385#process(soil,shaking) causes1way att_value(process(crop,growth),rate,increase)#23,21#none
s386#action(burning,vegetation_debris) causes1way att_value(soil,fertility,increase)#23,7#none
s387#att_value(fallow,length,increase) causes1way att_value(soil,fertility,increase)#23,7#none
s388#att_value(trees,density,decrease) causes1way process(sunlight,shining,soil)#23,13#none
s389#process(acheampong,shading,soil) causes1way att_value(soil,enyunu,decrease)#23#none
s390#att_value(weeds,density,increase) causes1way att_value(part(maize,leaves),colour,yellow)#7#none
s391#att_value(fallow,length,2 years) causes1way att_value(process(plantain,growth),rate,zero)#17#none
s392#att_value(action(uprooting,esre),ease,low) causes1way att_value(action(clearing,esre),ease,low)#17#none
s393#att_value(esre,density,increase) causes1way att_value(process(trees,colonisation),rate,decrease)#18,17#none
s394#process(ananse_treumu_huma,coiling,crop) causes1way att_value(action(clearing,ananse_treumu_huma),ease,low)#17#none
s395#att_value(trees,presence,negative) causes1way att_value(sunlight,intensity,increase)#17#none
s396#att_value(sunlight,intensity,increase) causes1way process(crop,death)#17#none
s397#not(process(monumia,death)) causes1way att_value(action(clearing,monumia),ease,low)#20#none
s398#att_value(process(monumia,growth),height,short) causes1way att_value(process(monumia,shading,crop),intensity,low)#20#none
s399#action(uprooting,acheampong) causes1way process(acheampong,death)#20#none
s400#process(acheampong,death) causes1way att_value(action(clearing,acheampong),ease,high)#20#none
s401#att_value(vegetation_debris,moisture,increase) causes2way att_value(action(burning,vegetation_debris),intensity,decrease)#20#none
s402#process(rainfall) causes1way att_value(vegetation_debris,moisture,increase)#20#none
s403#att_value(process(part(weeds,seed),dispersal),mechanism,river) causes1way att_value(process(weeds,colonisation),rate,increase)#1#none
s404#afonywie causes1way att_value(weeds,density,increase)#1#none
s405#action(burning,vegetation_debris) causes1way process(part(nkyenkyema,seed),germination)#1#none
s406#action(burning,vegetation_debris) causes1way process(part(tweta,seed),germination)#1#none
s407#action(burning,vegetation_debris) causes1way process(part(oil_palm,seed),germination)#1#none
s408#att_value(process(part(afonywie,nutrients),leaching),rate,increase) causes2way att_value(soil,fertility,decrease)#1#none
s409#att_value(process(part(asase_kokoo,nutrients),leaching),rate,decrease) causes2way att_value(soil,fertility,increase)#1#none
s410#att_value(process(weeds,competition,crop),resource,light) causes1way att_value(crop,yield,decrease)#8#none
s411#att_value(process(weeds,competition,crop),resource,soil_moisture) causes1way att_value(crop,yield,decrease)#8#none
s412#att_value(crop,density,increase) causes2way att_value(process(crop,shading,weeds),intensity,increase)#8#none
s413#att_value(soil,fertility,increase) causes1way att_value(crop,height,high)#8#none
s414#att_value(part(acheampong,stump_sprouts),density,increase) causes2way att_value(process(part(acheampong,stump_sprouts),shading,crop),intensity,increase)#4#none
s415#att_value(process(part(acheampong,stump_sprouts),shading,crop),intensity,increase) causes2way att_value(process(crop,growth),rate,decrease)#4#none
s416#att_value(process(crop,growth),tolerance,high) causes1way att_value(process(crop,growth),rate,average)#4#none
s417#att_value(part(acheampong,stem),density,low) causes1way not(att_value(process(acheampong,growth),pattern,grouped))#4#none
s418#att_value(action(clearing,esre),intensity,increase) causes1way att_value(action(clearing,esre),ease,low)#18,7#none
s419#att_value(process(esre,growth),rate,decrease) causes2way att_value(esre,density,decrease)#22,1#none
s420#att_value(process(part(esre,seed),survival),time,<1 year) causes1way not(att_value(part(esre,seed),presence,in_soil)) if att_value(nfofoa_kwae,presence,positive)#22,12,11#none
s421#att_value(action(use,herbicide,esre),effectiveness,decrease) causes1way att_value(action(clearing,esre),ease,low)#12,11,9#none
s422#att_value(process(esre,colonisation),rate,increase) causes2way att_value(esre,density,increase)#15#none
s423#att_value(part(esre,seed),density,decrease) causes2way att_value(esre,density,decrease)#15#none
s424#att_value(acheampong,density,increase) causes2way att_value(process(acheampong,shading,esre),intensity,increase)#15#none
s425#att_value(process(part(weeds,stump),sprouting),time,long) causes1way att_value(part(acheampong,stump_sprouts),density,decrease)#15#none
s426#comparison(appearance,afonywie,same_as,asase_kokoo) if att_value(fallow,stage,mature)#14#none
s427#comparison(growth_rate,crop,greater_than,weeds) if att_value(soil,fertility,high)#23#none
s428#comparison(fertility,asase_tuntum,greater_than,asase_kokoo)#18#none
s429#comparison(fertility,asase_kokoo,greater_than,ateche)#23,18,12,11,10,6#none
s430#comparison(fertility,ateche,greater_than,afonywie)#18,12,11#none
s431#comparison(soil_under,nfofoa_kwae,same_as,kwae)#18#none
s432#comparison(clearing_ease,esre,less_than,nkyenkyema)#22#none
s433#comparison(clearing_ease,nkyenkyema,less_than,acheampong)#22#none
s434#comparison(clearing_ease,nkyenkyema,less_than,ananse_treumu_huma)#9#none
s435#comparison(clearing_ease,nkyenkyema,less_than,ananse_dua)#9#none
s436#comparison(clearing_ease,ananse_treumu_huma,same_as,ananse_dua)#9#none
s437#comparison(clearing_ease,ananse_treumu_huma,less_than,acheampong)#9#none
s438#comparison(clearing_ease,part(fallow,acheampong),greater_than,part(fallow,esre))#14,12,11#none
s439#comparison(leaf_drop,trees,greater_than,acheampong)#6,1#none
s440#comparison(fertility,part(fallow,acheampong),greater_than,part(fallow,esre))#10#none
s441#comparison(fertility,part(fallow,nfofoa_kwae),greater_than,part(fallow,acheampong))#23,10#none
s442#comparison(clearing_ease,part(fallow,acheampong),greater_than,part(fallow,nfofoa_kwae))#19#none
s443#comparison(fertility,part(fallow,nfofoa_kwae),same_as,part(fallow,acheampong))#19#none
s444#comparison(weed_density,part(fallow,acheampong),greater_than,part(fallow,nfofoa_kwae))#23,19#none
s445#comparison(fertility_loss,afonywie,greater_than,asase_kokoo)#19#none
`;
