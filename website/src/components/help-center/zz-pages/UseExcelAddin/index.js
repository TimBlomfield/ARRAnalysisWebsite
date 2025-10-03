'use client';

import Image from 'next/image';
import useZoomableImage from '@/utils/client/useZoomableImage';
import { helpPages, HelpPageIndex } from '@/utils/help-pages';
// Components
import ImageViewer from '@/components/help-center/ImageViewer';
import Subtopics from '@/components/help-center/Subtopics';
// Images
import imgAddInActivated from  '@/../public/help-center/usage/Excel-Addin-Activated.png';
import imgInputGroup from  '@/../public/help-center/usage/Input-Group.png';
import imgSampleTemplateDialog from '@/../public/help-center/usage/Sample-Template-Dialog.png';
import imgPrimaryAnalysisGroup from '@/../public/help-center/usage/Primary-Analysis-Group.png';
import imgRunExpanded from '@/../public/help-center/usage/Run-Expanded.png';
import imgExcelPrimaryAnalysis from '@/../public/help-center/usage/Excel-Primary-Analysis.png';
import imgSecondaryAnalysisGroup from '@/../public/help-center/usage/Secondary-Analysis-Group.png';
import imgWaterfallTable from '@/../public/help-center/usage/Waterfall-Table.png';
import imgExcelSecondaryTTM from '@/../public/help-center/usage/Excel-Secondary-TTM.png';
import imgExcelSecondaryTtmGraph from '@/../public/help-center/usage/Excel-Secondary-TTM-Graph.png';
import imgSaaSAnalystGroup from '@/../public/help-center/usage/SaaS-Analyst-Group.png';
import imgExcelSaaSCohortAnalysis from '@/../public/help-center/usage/Excel-SaaS-Cohort-Analysis.png';
import imgExcelSaaSSizeCohort from '@/../public/help-center/usage/Excel-SaaS-Size-Cohort.png';
import imgExcelSaaSCustomerSizeHistogram from '@/../public/help-center/usage/Excel-SaaS-Customer-Size-Histogram.png';
import imgExcelSaaSChurnAnalysis from '@/../public/help-center/usage/Excel-SaaS-Churn-Analysis.png';
import imgExcelSaaSChurnGraph from '@/../public/help-center/usage/Excel-SaaS-Churn-Graph.png';
import imgFullStackAnalystGroup from '@/../public/help-center/usage/Full-Stack-Analyst-Group.png';
import imgExcelFullStackTopChurns from '@/../public/help-center/usage/Excel-FullStack-Top-Churns.png';
import imgExcelFullStackUnitEconomics from '@/../public/help-center/usage/Excel-FullStack-Unit-Economics.png';
import imgSegmentsExpanded from '@/../public/help-center/usage/Segments-Expanded.png';
import imgExcelFullStackSegment from '@/../public/help-center/usage/Excel-FullStack-Segment.png';
import imgArrAnalysisGroup from '@/../public/help-center/usage/ARR-Analysis-Group.png';
// Styles
import styles from '../common.module.scss';


const UseExcelAddinPage = () => {
  const [image, setImage] = useZoomableImage();

  return (
    <section className={styles.main}>
      <article className={styles.full}>
        <h1>Using the ARR Analysis Excel Add-in</h1>
        <p>This page explains how to use the <strong>ARR Analysis Excel Add-in</strong> to analyze annual recurring revenue (ARR) and related SaaS metrics.</p>
        <p>The add-in appears in Excel as a ribbon with six groups of features. Each group contains buttons that generate reports, visualizations, and analyses from your ARR data.</p>
        <p>You can also refer to the <strong>usage video</strong> availble here:</p>
        <Subtopics topics={[helpPages.indexer[HelpPageIndex.HelpCenter]]} />
        <hr />
        <h2>1. Open Excel and Access the Add-in</h2>
        <ul>
          <li>Launch Excel and open a workbook.</li>
          <li>Ensure the ARR Analysis Add-in is installed — it appears as a dedicated ribbon tab at the top of Excel.</li>
        </ul>
        <Image className={styles.clickableImage}
               style={{ width: 'min(700px, 100%)' }}
               src={imgAddInActivated}
               alt="Excel with Add-in activated"
               priority
               onClick={() => setImage({ img: imgAddInActivated, alt: 'Excel with Add-in activated' })} />
        <hr />
        <h2>2. Input</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgInputGroup}
               alt="Input Group"
               onClick={() => setImage({ img: imgInputGroup, alt: 'Input Group' })} />
        <ul>
          <li><strong className={styles.more}>Upload Template</strong> – Upload a prepared Excel template file with ARR data (by customer and month).</li>
          <li><strong className={styles.more}>Sample Template</strong> – Generate a sample template pre-filled with fake data, which helps you understand the required format for your real data.</li>
        </ul>
        <p>When generating a sample template, a dialog will appear with the following options:</p>
        <ul>
          <li>Number of rows of fake data</li>
          <li>Number of months of ARR data per row</li>
          <li>Maximum number of HQ countries to include (useful to avoid performance issues from too many country-based segments)</li>
          <li>Option to simulate missing data: you can choose a percentage of missing values in columns like <em>Company Size</em>, <em>Employees</em>, <em>HQ Country</em>, <em>Region</em>, <em>Channel</em>.</li>
        </ul>
        <p>You can use this sample file as a guide by replacing the fake data with your real data.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(500px, 100%)' }}
               src={imgSampleTemplateDialog}
               alt="Generate Sample Template Dialog"
               onClick={() => setImage({ img: imgSampleTemplateDialog, alt: 'Generate Sample Template Dialog' })} />
        <hr />
        <h2>3. Primary Analysis</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgPrimaryAnalysisGroup}
               alt="Primary Analysis Group"
               onClick={() => setImage({ img: imgPrimaryAnalysisGroup, alt: 'Primary Analysis Group' })} />
        <ul>
          <li>
            <div><strong className={styles.more}>Run</strong> – Generates sheets with four standard overviews:</div>
            <ul>
              <li>Annual</li>
              <li>LTM (Last Twelve Months)</li>
              <li>Monthly</li>
              <li>Quarterly</li>
            </ul>
          </li>
          <li>
            <div>Use the dropdown on the Run button to run a single analysis (e.g., just Quarterly) instead of all four.</div>
            <Image className={styles.clickableImage}
                   style={{ maxWidth: '100%' }}
                   src={imgRunExpanded}
                   alt="Primary Analysis - Expanded"
                   onClick={() => setImage({ img: imgRunExpanded, alt: 'Primary Analysis - Expanded' })} />
          </li>
        </ul>
        <p>These analyses calculate new ARR, upsell, downsell, and churn. They also generate customer rankings and cohort analyses.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(600px, 100%)' }}
               src={imgExcelPrimaryAnalysis}
               alt="Excel, Primary Analysis"
               onClick={() => setImage({ img: imgExcelPrimaryAnalysis, alt: 'Excel, Primary Analysis' })} />
        <hr />
        <h2>4. Secondary Analysis</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgSecondaryAnalysisGroup}
               alt="Secondary Analysis Group"
               onClick={() => setImage({ img: imgSecondaryAnalysisGroup, alt: 'Secondary Analysis Group' })} />
        <ul>
          <li>
            <div><strong className={styles.more}>Waterfalls &amp; Trending</strong>– Generates waterfall analyses:</div>
            <ul>
              <li>ARR over time (annual)</li>
              <li>Logo waterfall</li>
              <li>Gross and net retention</li>
              <li>New bookings and churn</li>
            </ul>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(300px, 100%)' }}
                   src={imgWaterfallTable}
                   alt="Waterfall Table"
                   onClick={() => setImage({ img: imgWaterfallTable, alt: 'Waterfall Table' })} />
          </li>
          <li>
            <div>You can also create rolling analyses for Monthly, Quarterly, and Trailing Twelve Months (TTM), including:</div>
            <ul>
              <li>Net and gross dollar retention</li>
              <li>Net new bookings</li>
              <li>ARR growth</li>
              <li>Logo growth and churn</li>
              <li>CAGR metrics</li>
            </ul>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSecondaryTTM}
                   alt="Excel, Secondary Analysis, TTM"
                   onClick={() => setImage({ img: imgExcelSecondaryTTM, alt: 'Excel, Secondary Analysis, TTM' })} />
          </li>
        </ul>
        <p>The TTM Metrics sheet also includes automatically generated charts for quick visualization.</p>
        <Image className={styles.clickableImage}
               style={{ width: 'min(600px, 100%)' }}
               src={imgExcelSecondaryTtmGraph}
               alt="Excel, Secondary Analysis, TTM Graph"
               onClick={() => setImage({ img: imgExcelSecondaryTtmGraph, alt: 'Excel, Secondary Analysis, TTM Graph' })} />
        <hr />
        <h2>5. SaaS Analyst</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgSaaSAnalystGroup}
               alt="SaaS Analyst Group"
               onClick={() => setImage({ img: imgSaaSAnalystGroup, alt: 'SaaS Analyst Group' })} />
        <p>This tier enables deeper analysis of customer size distributions, churn, and retention.</p>
        <ul>
          <li>
            <div><strong className={styles.more}>Cohort Analysis</strong> – Generates quarterly cohort performance and retention metrics.</div>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSaaSCohortAnalysis}
                   alt="Excel, SaaS, Cohort Analysis"
                   onClick={() => setImage({ img: imgExcelSaaSCohortAnalysis, alt: 'Excel, SaaS, Cohort Analysis' })} />
          </li>
          <li>
            <div><strong className={styles.more}>Size Cohort</strong> – Shows customer size distribution and ARR contribution, with table + chart outputs.</div>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSaaSSizeCohort}
                   alt="Excel, SaaS, Size Cohort"
                   onClick={() => setImage({ img: imgExcelSaaSSizeCohort, alt: 'Excel, SaaS, Size Cohort' })} />
          </li>
          <li>
            <div><strong className={styles.more}>Customer Size Histogram</strong> – Displays ARR distribution as a histogram.</div>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSaaSCustomerSizeHistogram}
                   alt="Excel, SaaS, Customer Size Histogram"
                   onClick={() => setImage({ img: imgExcelSaaSCustomerSizeHistogram, alt: 'Excel, SaaS, Customer Size Histogram' })} />
          </li>
          <li>
            <div><strong className={styles.more}>Churn Analysis</strong> – Analyzes churn by tenure (months before churn). Includes tables and charts showing average retention over time.</div>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSaaSChurnAnalysis}
                   alt="Excel, SaaS, Churn Analysis"
                   onClick={() => setImage({ img: imgExcelSaaSChurnAnalysis, alt: 'Excel, SaaS, Churn Analysis' })} />
            <div>The add-in will also generate a table and graph to show churn by tenure on average for individual months, allowing the analyst to assess how a company retains over time, on average.</div>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelSaaSChurnGraph}
                   alt="Excel, SaaS, Churn Graph"
                   onClick={() => setImage({ img: imgExcelSaaSChurnGraph, alt: 'Excel, SaaS, Churn Graph' })} />
          </li>
        </ul>
        <hr />
        <h2>6. Full Stack Analyst</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgFullStackAnalystGroup}
               alt="Full Stack Analyst Group"
               onClick={() => setImage({ img: imgFullStackAnalystGroup, alt: 'Full Stack Analyst Group' })} />
        <ul>
          <li>
            <div><strong className={styles.more}>Top Churns</strong> – Lists the largest churned customers, including:</div>
            <ul>
              <li>Customer name</li>
              <li>ARR size</li>
              <li>Churn amount</li>
              <li>Customer tenure</li>
            </ul>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelFullStackTopChurns}
                   alt="Excel, FullStack, Top Churns"
                   onClick={() => setImage({ img: imgExcelFullStackTopChurns, alt: 'Excel, FullStack, Top Churns' })} />
          </li>
          <li>
            <div><strong className={styles.more}>Unit Economics</strong> – Calculates:</div>
            <ul>
              <li>Lifetime Value (LTV)</li>
              <li>Customer lifetime</li>
              <li>
                <div>LTV/CAC ratio</div>
                <div><em>(Requires rolling annual Sales & Marketing spend and monthly gross margin inputs)</em></div>
              </li>
            </ul>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelFullStackUnitEconomics}
                   alt="Excel, FullStack, Unit Economics"
                   onClick={() => setImage({ img: imgExcelFullStackUnitEconomics, alt: 'Excel, FullStack, Unit Economics' })} />
          </li>
          <li>
            <div><strong className={styles.more}>Segments</strong> – Runs ARR analysis by segments (e.g., industry, region, product).</div>
            <Image className={styles.clickableImage}
                   style={{ maxWidth: '100%' }}
                   src={imgSegmentsExpanded}
                   alt="Segments - Expanded"
                   onClick={() => setImage({ img: imgSegmentsExpanded, alt: 'Segments - Expanded' })} />
            <p>Generates:</p>
            <ul>
              <li>Segment-specific waterfalls and trending</li>
              <li>ARR and logo counts by segment</li>
              <li>Rolling (Quarterly/TTM) waterfalls per segment</li>
              <li>Customer size distributions by segment</li>
            </ul>
            <Image className={styles.clickableImage}
                   style={{ width: 'min(600px, 100%)' }}
                   src={imgExcelFullStackSegment}
                   alt="Excel, FullStack, Segment"
                   onClick={() => setImage({ img: imgExcelFullStackSegment, alt: 'Excel, FullStack, Segment' })} />
          </li>
          <li><strong className={styles.more}>Export</strong>– Exports generated analyses into a ready-to-use PowerPoint presentation.</li>
        </ul>
        <hr />
        <h2>7. ARR Analysis Group</h2>
        <Image className={styles.clickableImage}
               style={{ maxWidth: '100%' }}
               src={imgArrAnalysisGroup}
               alt="ARR Analysis Group"
               onClick={() => setImage({ img: imgArrAnalysisGroup, alt: 'ARR Analysis Group' })} />
        <ul>
          <li><strong className={styles.more}>License</strong> – Activate or manage your license.</li>
          <li><strong className={styles.more}>Help Center</strong> – Open the online documentation.</li>
          <li><strong className={styles.more}>About</strong> – View version information about the add-in.</li>
        </ul>
        <hr />
        <h2>Cautionary Notes</h2>
        <ul>
          <li>Make sure the uploaded template contains accurate and up-to-date data.</li>
          <li>Some features are only available depending on your subscription tier.</li>
        </ul>
        <hr />
        <h2>Tips for Efficiency</h2>
        <ul>
          <li>Familiarize yourself with the ribbon layout to quickly find the tools you need.</li>
          <li>Use Excel keyboard shortcuts to work faster.</li>
          <li>Save your work regularly to avoid data loss.</li>
        </ul>
        <ImageViewer image={image?.img} alt={image?.alt} notifyClosed={() => setImage(null)} />
      </article>
    </section>
  );
};


export default UseExcelAddinPage;
