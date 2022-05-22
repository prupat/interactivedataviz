# Graduate Center Class Project: Covid-19 Death Toll Rate by US State

The goal of this project is to design a webpage with an interactive chart, capturing the Covid-19 death toll in each single state for the year 2020 only. We can then compare the number of cases at a specific point of the year, in this case, the monthly death across states. Although, this project aimed to showcase the death toll related to Covid-19, it didn't, however, plan on showcasing or studying any underlying health conditions associated with the Covid-19 death neither investigating the origins of the outbreak.

The project is merely a graphic representation of the 2020 death toll using the "Covid Tracking Project State Data". The users will be able to use this platform as they see fit, whether to investigate the social impact of the disease on communities of color, or use it as a mere resource to keep them abreast of the disease. Whether we want to explore the social or health or both aspect(s) of this project, the choice is ours.   
     

The visualization I created is an interactive line chart using D3.js with the number of deaths on the Y-axis, the months (Jan – Dec) on the X-axis along with 2 drop-down for comparison. The user will have the ability to compare the death toll from different geographic regions. For example, the user may want to analyze the death disparity between two (2) of the densely populated US states, California and Texas. Perhaps, the user wants to compare states by geographic regions, New York vs. Florida, i.e., East Coast vs. South.

The Covid Tracking Project State Data is the dataset used for this project. The file is an Excel spreadsheet, which I saved as a CSV file. The spreadsheet contains around 20,000 records with multiple field names. I did a bit of cleaning by:
1.	Removing all irrelevant fields out of the scoop of this project
2.	Inserting a pivot table to group the daily data into an aggregate monthly data (the death toll was recorded daily from February 2020 to March 2021), hence the grouping. 
3.	Transposing the dataset to have the states displayed in row and the months in column along with the numerical values

# Hurdles Encountered 

1. I initially wanted to create a bar chart, but opted in for a line chart. The reason is that my dataset contained null values for the months of January, February and March where most states did not report or did not start reporting the death toll. As a result, the bar charts couldn’t be displayed. 
2. I also had issues with the line chart as the values associated to the X-axis were stored as string or text format instead of date format. But, the issue was resolving using the appropritate date format syntax. 



